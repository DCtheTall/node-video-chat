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

const socket = io();
const Statuses = new Enum([
  'Available',
  'Testing',
  'Calling',
  'ReceivingCall',
  'AcceptingCall',
]);

const hideElement = e => e.style.display = 'none';
const showElement = e => e.style.display = 'block';
const stopStream = stream => stream.getTracks().forEach(track => track.stop());
const displayError = msg => errorMessage.innerHTML = msg;
const clearError = () => displayError('');

// These vars will represent local state
// in a production env use a state manager
let currentStatus = Statuses.Available;
let localStream;
let pc;
let remoteSocketId;

/*

Local video

*/

async function startLocalVideo() {
  if (localVideo.srcObject) return;
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  localVideo.srcObject = localStream;
}

function endVideoTest() {
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;
  stopStream(localStream);
  testVideoButton.innerHTML = 'Test video';
  testVideoButton.removeEventListener('click', endVideoTest);
  testVideoButton.addEventListener('click', testVideo);
  currentStatus = Statuses.Available;
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
  currentStatus = Statuses.Testing;
}

/*

Signaling functions for socket.io

*/

function sendMessage({}) {}

/*

WebRTC code

*/

function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ' + event);
  if (event.candidate) {
    // TODO
    // socket.emit('ice:candidate', {
    //   label: event.candidate.sdpMLineIndex,
    // });
  }
}

function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(null);
    pc.onicecandidate = handleIceCandidate;
    // pc.onaddstream
    // pc.onremovestream
  } catch (err) {
    console.error(err);
    alert('Failed to create peer connection');
  }
}

function handleCreateOfferError(event) {
  console.log('createOffer() error: ', e);
}

function setLocalDescAndSendMessage(description) {
  description.sdp = preferOpus(description.sdp);
  pc.setLocalDescription(description);
  console.log('setLocalAndSendMessage sending message', sessionDescription);
  socket.emit('session:description', description);
}

/*

Handlers for emitting a call request to another user

*/

function applyToInitialControls(fn) {
  fn(testVideoButton);
  fn(socketIdInput);
  fn(callButton);
}

const hideInitialControls = applyToInitialControls.bind(null, hideElement);
const showInitialControls = applyToInitialControls.bind(null, showElement);

function handleCallCanceled() {
  hideElement(hangUpButton);
  hangUpButton.removeEventListener('click', handleCallCanceled);
  showInitialControls();
  stopStream(localStream);
  socket.emit('call:canceled', { toId: remoteSocketId });
  currentStatus = Statuses.Available;
}

async function startCall() {
  clearError();
  if (!socketIdInput.value) return;
  try {
    if (currentStatus === Statuses.Testing) endVideoTest();
    hideInitialControls();
    showElement(hangUpButton);
    hangUpButton.addEventListener('click', handleCallCanceled);
    await startLocalVideo();
    remoteSocketId = socketIdInput.value;
    socket.emit('call:request', { toId: remoteSocketId });
    currentStatus = Statuses.Calling;
    setTimeout(
      () => handleUnsuccessfulCall({ toId: remoteSocketId }),
      25000
    );
    socketIdInput.value = '';
  } catch (err) {
    currentStatus = Statuses.Available;
    console.error(err);
  }
}

function handleUnsuccessfulCall({ toId }) {
  if (currentStatus !== Statuses.Calling) return;
  displayError(`Socket ${toId} is not available.`);
  localVideo.srcObject = null;
  stopStream(localStream);
  showInitialControls();
  setTimeout(clearError, 1e4);
  remoteSocketId = null;
  currentStatus = Statuses.Available;
}

/*

Handlers for responding to a call

*/

function applyToAnswerControls(fn) {
  fn(callAcceptButton);
  fn(callIgnoreButton);
}

const hideAnswerControls = applyToAnswerControls.bind(null, hideElement);
const showAnswerControls = applyToAnswerControls.bind(null, showElement);

function ignoreCall() {
  if (currentStatus !== Statuses.ReceivingCall) return;
  showInitialControls();
  hideAnswerControls();
  statusMessage.innerHTML = '';
  socket.emit('call:ignored', { fromId: remoteSocketId });
  remoteSocketId = null;
  currentStatus = Statuses.Available;
}

async function acceptCall() {
  try {
    await startLocalVideo();
  } catch (err) {
    displayError('Something went wrong starting the video');
    console.error(err);
    return;
  }
  hideAnswerControls();
  statusMessage.innerHTML = `In call with ${remoteSocketId}`;
  socket.emit('call:accepted', { fromId: remoteSocketId });
  currentStatus = Statuses.CallAccepted;
}

function handleCallReceived({ fromId }) {
  currentStatus = Statuses.ReceivingCall;
  hideInitialControls();
  showAnswerControls();
  statusMessage.innerHTML = `Receiving call from ${fromId}`;
  remoteSocketId = fromId;
  setTimeout(ignoreCall, 25000);
}

function handleCallAccepted({ toId }) {
  if (currentStatus !== Statuses.Calling) {
    // TODO emit hangup to other socket
  }
  statusMessage.innerHTML = `In call with ${remoteSocketId}`;
  hangUpButton.removeEventListener('click', handleCallCanceled);
  currentStatus = Statuses.CallAccepted;
}

// Socket events
socket.on('connect', () => (socketIdBanner.innerHTML = `Your socket ID: ${socket.id}`));
socket.on('call:unavailable', handleUnsuccessfulCall);
socket.on('call:received', handleCallReceived);
socket.on('call:canceled', () => {
  showInitialControls();
  hideAnswerControls();
  remoteSocketId = null;
  statusMessage.innerHTML = '';
  currentStatus = Statuses.Available;
});
socket.on('call:accepted', handleCallAccepted);

// Attach event listeners to DOM nodes
testVideoButton.addEventListener('click', testVideo);
callButton.addEventListener('click', startCall);
callIgnoreButton.addEventListener('click', ignoreCall);
callAcceptButton.addEventListener('click', acceptCall);

// Hide elements that aren't needed yet
hideElement(hangUpButton);
hideElement(callAcceptButton);
hideElement(callIgnoreButton);
