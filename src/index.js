require('webrtc-adapter'); // webrtc browswer polyfill

const io = require('socket.io-client');
const Enum = require('enum');

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
]);

// These vars will represent local state
let localStream;
let currentStatus = Statuses.Available;
let remoteSocketId;

const hideElement = e => e.style.display = 'none';
const showElement = e => e.style.display = 'block';
const stopStream = stream => stream.getTracks().forEach(track => track.stop());
const displayError = msg => errorMessage.innerHTML = msg;
const clearError = () => displayError('');

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
  currentStatus = Statues.Available;
}

async function testVideo() {
  try {
    await startLocalVideo();
    remoteVideo.srcObject = localStream;
    testVideoButton.innerHTML = 'End test';
    testVideoButton.removeEventListener('click', testVideo);
    testVideoButton.addEventListener('click', endVideoTest);
    currentStatus = Statuses.Testing;
  } catch (err) {
    console.error(err);
  }
}

function applyToInitialControls(fn) {
  fn(testVideoButton);
  fn(socketIdInput);
  fn(callButton);
}

const hideInitialControls = applyToInitialControls.bind(null, hideElement);
const showInitialControls = applyToInitialControls.bind(null, showElement);

async function startCall() {
  clearError();
  if (!socketIdInput.value) return;
  try {
    if (currentStatus === Statuses.Testing) endVideoTest();
    hideInitialControls();
    await startLocalVideo();
    currentStatus = Statuses.Calling;
    remoteSocketId = socketIdInput.value;
    socket.emit('call:request', { toId: remoteSocketId });
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

function ignoreCall() {
  if (currentStatus !== Statuses.ReceivingCall) return;
  showInitialControls();
  hideElement(callAcceptButton);
  hideElement(callIgnoreButton);
  socket.emit('call:ignored', { fromId: remoteSocketId });
  remoteSocketId = null;
  currentStatus = Statuses.Available;
}

function handleCallReceived({ fromId }) {
  currentStatus = Statuses.ReceivingCall;
  hideInitialControls();
  showElement(callAcceptButton);
  showElement(callIgnoreButton);
  statusMessage.innerHTML = `Receiving call from ${fromId}`;
  remoteSocketId = fromId;
  setTimeout(ignoreCall, 25000);
}

hideElement(hangUpButton);
hideElement(callAcceptButton);
hideElement(callIgnoreButton);

socket.on('connect', () => (socketIdBanner.innerHTML = `Your socket ID: ${socket.id}`));
socket.on('call:unavailable', handleUnsuccessfulCall);
socket.on('call:received', handleCallReceived);

testVideoButton.addEventListener('click', testVideo);
callButton.addEventListener('click', startCall);
