require('webrtc-adapter'); // webrtc browswer polyfill

const io = require('socket.io-client');
const Enum = require('enum');
const { preferOpus } = require('./sdp-helpers');

const socketIdBanner = document.getElementById('socket-id-banner');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const testVideoButton = document.getElementById('test-video-button');
const hangUpButton = document.getElementById('hang-up-button');
const socketIdInput = document.getElementById('socket-id-input');
const callButton = document.getElementById('call-button');
const errorMessage = document.getElementById('error-message');
const callAcceptButton = document.getElementById('call-accept-button');
const callIgnoreButton = document.getElementById('call-ignore-button');
const statusMessage = document.getElementById('status-message');
const toggleSound = document.getElementById('toggle-sound');
const toggleVideo = document.getElementById('toggle-video');

const socket = io();
const Statuses = new Enum([
  'Available',
  'Testing',
  'Calling',
  'ReceivingCall',
  'AcceptingCall',
  'InCall',
]);
const sdpConstraints = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true,
  },
};

const hideElement = e => e.style.display = 'none';
const showElement = e => e.style.display = 'block';
const stopStream = stream => stream.getTracks().forEach(track => track.stop());
const clearError = () => displayError('');

function applyToInitialControls(fn) {
  fn(testVideoButton);
  fn(socketIdInput);
  fn(callButton);
}

const hideInitialControls = applyToInitialControls.bind(null, hideElement);
const showInitialControls = applyToInitialControls.bind(null, showElement);

function applyToAnswerControls(fn) {
  fn(callAcceptButton);
  fn(callIgnoreButton);
}

const hideAnswerControls = applyToAnswerControls.bind(null, hideElement);
const showAnswerControls = applyToAnswerControls.bind(null, showElement);

// These vars will represent local state
// in a production env use a state manager
let currentStatus = Statuses.Available;
let localStream;
let iceServerConfig;
let pc;
let remoteStream;
let remoteSocketId;

function setCurrentStatus(newStatus) {
  const statusMessages = {
    [Statuses.Available]: 'available',
    [Statuses.Testing]: 'testing',
    [Statuses.Calling]: 'calling',
    [Statuses.ReceivingCall]: 'receiving call',
    [Statuses.AcceptingCall]: 'accepting call',
    [Statuses.InCall]: 'in call',
  };
  console.log(`Status set to ${statusMessages[newStatus]}`);
  currentStatus = newStatus;
}

function displayError(msg) {
  errorMessage.innerHTML = msg;
  setTimeout(clearError, 5e3);
}

/*

Local video

*/

function endVideo() {
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;
  if (localStream) {
    stopStream(localStream);
    localStream = null;
  }
  if (remoteStream) {
    stopStream(remoteStream);
    remoteStream = null;
  }
}

async function startLocalVideo() {
  if (localVideo.srcObject) return;
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
}

function endVideoTest() {
  endVideo();
  testVideoButton.innerHTML = 'Test video';
  testVideoButton.removeEventListener('click', endVideoTest);
  testVideoButton.addEventListener('click', testVideo);
  setCurrentStatus(Statuses.Available);
}

async function testVideo() {
  try {
    await startLocalVideo();
  } catch (err) {
    if (/allowed/i.test(err.name)) displayError('Please allow camera access to use this app.');
    else displayError('Something went wrong starting the video');
    console.error(err);
    return;
  }
  remoteVideo.srcObject = localStream;
  testVideoButton.innerHTML = 'End test';
  testVideoButton.removeEventListener('click', testVideo);
  testVideoButton.addEventListener('click', endVideoTest);
  setCurrentStatus(Statuses.Testing);
}

function toggleLocalTack(i) {
  if (!localStream) return;
  const audio = localStream.getTracks()[i];
  audio.enabled = !audio.enabled;
}

toggleSound.addEventListener('click', toggleLocalTack.bind(null, 0));
toggleVideo.addEventListener('click', toggleLocalTack.bind(null, 1));

/*

WebRTC code

*/

function emitHangup() {
  console.log('Hanging up...');
  socket.emit('call:hangup', { toId: remoteSocketId });
  remoteSocketId = null;
  endVideo();
  setCurrentStatus(Statuses.Available);
}


function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ' + event);
  if (event.candidate) {
    socket.emit('ice:candidate', {
      toId: remoteSocketId,
      data: {
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      },
    });
  }
}

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  remoteVideo.srcObject = event.stream;
  remoteStream = event.stream;
}

function handleRemoteStreamRemoved() {
  console.log('Remote stream removed.');
  remoteVideo.srcObject = null;
  stopStream(remoteStream);
}

function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(iceServerConfig);
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
  } catch (err) {
    console.error(err);
    displayError('Failed to create peer connection');
  }
}

function handleCreateOfferError(event) {
  console.log('createOffer() error: ', e);
}

function setLocalDescAndSendMessage(description) {
  description.sdp = preferOpus(description.sdp);
  pc.setLocalDescription(description);
  socket.emit('session:description', {
    description,
    toId: remoteSocketId,
  });
}

function startPeerConnection(isInitiator = false) {
  createPeerConnection();
  pc.addStream(localStream);
  if (!isInitiator) return;
  pc.createOffer(
    setLocalDescAndSendMessage,
    e => (
      console.log('createOffer() error', e)
      || displayError('Something went wrong setting up the peer connection')
    )
  );
}

function handleIceCandidateReceived({ data }) {
  if (!pc) {
    emitHangup();
    return;
  }
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: data.label,
    candidate: data.candidate,
  });
  pc.addIceCandidate(candidate);
  setCurrentStatus(Statuses.InCall);
}

function setRemoteDesc({ description }) {
  if (!pc) {
    emitHangup();
    return;
  }
  pc.setRemoteDescription(new RTCSessionDescription(description));
}

function setRemoteDescAndAnswer(data) {
  setRemoteDesc(data);
  pc.createAnswer(
    setLocalDescAndSendMessage,
    e => (
      console.log('createAnswer() error', e)
      || displayError('Something went wrong setting up the peer connection')
    ),
    sdpConstraints
  );
}

function closePeerConnection() {
  if (pc) {
    pc.close();
    pc = null;
  }
}

function hangUp() {
  if (currentStatus !== Statuses.InCall) {
    return;
  }
  hangUpButton.removeEventListener('click', hangUp);
  statusMessage.innerHTML = '';
  emitHangup(); // status set here
  hideElement(hangUpButton);
  showInitialControls();
  closePeerConnection();
}

function handleHangup() {
  if (currentStatus !== Statuses.InCall) {
    return;
  }
  hangUpButton.removeEventListener('click', hangUp);
  remoteSocketId = null;
  statusMessage.innerHTML = '';
  endVideo();
  setCurrentStatus(Statuses.Available);
  showInitialControls();
  hideElement(hangUpButton);
  closePeerConnection();
}

/*

Handlers for emitting a call request to another user

*/

function cancelCall() {
  statusMessage.innerHTML = '';
  hangUpButton.removeEventListener('click', cancelCall);
  socket.emit('call:canceled', { toId: remoteSocketId });
  remoteSocketId = null;
  stopStream(localStream);
  showInitialControls();
  hideElement(hangUpButton);
  setCurrentStatus(Statuses.Available);
}

function handleUnsuccessfulCall({ toId }) {
  if (currentStatus !== Statuses.Calling) return;
  localVideo.srcObject = null;
  remoteSocketId = null;
  showInitialControls();
  stopStream(localStream);
  setTimeout(clearError, 1e4);
  displayError(`Socket ${toId} is not available.`);
  setCurrentStatus(Statuses.Available);
}

async function startCall() {
  clearError();
  if (!socketIdInput.value) return;
  try {
    if (currentStatus === Statuses.Testing) endVideoTest();
    hideInitialControls();
    showElement(hangUpButton);
    hangUpButton.addEventListener('click', cancelCall);
    await startLocalVideo();
    remoteSocketId = socketIdInput.value;
    socketIdInput.value = '';
    socket.emit('call:request', { toId: remoteSocketId });
    setTimeout(
      () => handleUnsuccessfulCall({ toId: remoteSocketId }),
      25000
    );
    setCurrentStatus(Statuses.Calling);
  } catch (err) {
    setCurrentStatus(Statuses.Available);
    console.error(err);
    displayError('Something went wrong starting the call');
  }
}

function handleCallAccepted({ iceServerConfig: config }) {
  if (currentStatus !== Statuses.Calling) {
    emitHangup();
    return;
  }
  iceServerConfig = config;
  statusMessage.innerHTML = `In call with ${remoteSocketId}`;
  hangUpButton.removeEventListener('click', cancelCall);
  hangUpButton.addEventListener('click', hangUp);
  currentStatus = Statuses.CallAccepted;
  startPeerConnection(true);
}

/*

Handlers for responding to a call

*/

function handleCallCanceled() {
  remoteSocketId = null;
  statusMessage.innerHTML = '';
  hangUpButton.removeEventListener('click', cancelCall);
  hideAnswerControls();
  showInitialControls();
  hideElement(hangUpButton);
  setCurrentStatus(Statuses.Available);
}

function ignoreCall() {
  if (currentStatus !== Statuses.ReceivingCall) return;
  showInitialControls();
  hideAnswerControls();
  statusMessage.innerHTML = '';
  socket.emit('call:ignored', { fromId: remoteSocketId });
  remoteSocketId = null;
  setCurrentStatus(Statuses.Available);
}

async function acceptCall() {
  try {
    await startLocalVideo();
  } catch (err) {
    displayError('Something went wrong starting the video');
    console.error(err);
    return;
  }
  statusMessage.innerHTML = `In call with ${remoteSocketId}`;
  socket.emit('call:accepted', { fromId: remoteSocketId });
  hangUpButton.addEventListener('click', hangUp);
  hideAnswerControls();
  showElement(hangUpButton);
  startPeerConnection();
}

function handleCallReceived({ fromId }) {
  statusMessage.innerHTML = `Receiving call from ${fromId}`;
  remoteSocketId = fromId;
  hideInitialControls();
  showAnswerControls();
  setTimeout(ignoreCall, 25e3);
  setCurrentStatus(Statuses.ReceivingCall);
}

// Socket events
socket.on('connect', () => (socketIdBanner.innerHTML = `Your socket ID: ${socket.id}`));

socket.on('call:unavailable', handleUnsuccessfulCall);
socket.on('call:received', handleCallReceived);
socket.on('call:canceled', handleCallCanceled);
socket.on('call:accepted', handleCallAccepted);
socket.on('call:hangup', handleHangup);

socket.on('ice:config', ({ iceServerConfig: config }) => iceServerConfig = config);
socket.on('ice:offer', setRemoteDescAndAnswer);
socket.on('ice:answer', setRemoteDesc);
socket.on('ice:candidate', handleIceCandidateReceived);

// Attach event listeners to DOM nodes
testVideoButton.addEventListener('click', testVideo);
callButton.addEventListener('click', startCall);
callIgnoreButton.addEventListener('click', ignoreCall);
callAcceptButton.addEventListener('click', acceptCall);

// Hide elements that aren't needed yet
hideElement(hangUpButton);
hideElement(callAcceptButton);
hideElement(callIgnoreButton);

window.addEventListener('beforeunload', hangUp);
