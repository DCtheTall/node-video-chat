require('webrtc-adapter'); // webrtc browswer polyfill

const startButton = document.getElementById('start-button');
const callButton = document.getElementById('call-button');
const hangUpButton = document.getElementById('hang-up-button');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

let localStream;
let peerConnection1;
let peerConnection2;

const getOtherConnection = pc => (pc === peerConnection1 ? peerConnection2 : peerConnection1);
const getConnectionName = pc => (pc === peerConnection1 ? 'peerConnection1' : 'peerConnection2');

function onIceCandidate(peerConnection, event) {
  console.log(`${getConnectionName(peerConnection)} ICE candidate: ${event.candidate ? event.candidate.candidate : null}`);
  return getOtherConnection(peerConnection)
    .addIceCandidate(event.candidate)
    .then(pc => console.log(`${getConnectionName(pc)} addIceCandidate success`))
    .catch(console.error);
}

function onIceStateChange(peerConnection, event) {
  if (peerConnection) {
    console.log(`${getConnectionName(peerConnection)} ICE state change: ${event}`);
  }
}

function gotRemoteStream(event) {
  const { streams: [stream] } = event;
  if (remoteVideo.srcObject !== stream) {
    remoteVideo.srcObject = stream;
  }
}

function onSetLocalSuccess(peerConnection) {
  console.log(`${getConnectionName(peerConnection)} setLocalDescription complete`);
}

function onSetRemoteSuccess(peerConnection) {
  console.log(`${getConnectionName(peerConnection)} setRemoteDescription complete`);
}

function onCreateAnswerSuccess(description) {
  console.log(`Answer from pc2:\n ${description.sdp}`);

  peerConnection2.setLocalDescription(description)
    .then(() => onSetLocalSuccess(peerConnection2))
    .catch(console.error);

  peerConnection1.setRemoteDescription(description)
    .then(() => onSetRemoteSuccess(peerConnection1))
    .catch(console.error);
}

function onCreateOfferSuccess(description) {
  console.log(`Offer from pc1:\n${description.sdp}`);

  peerConnection1.setLocalDescription(description)
    .then(() => onSetLocalSuccess(peerConnection1))
    .catch(console.error);

  peerConnection2.setRemoteDescription(description)
    .then(() => onSetRemoteSuccess(peerConnection2))
    .catch(console.error);

  return peerConnection2.createAnswer()
    .then(onCreateAnswerSuccess)
    .catch(console.error);
}

function start() {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  })
  .catch(console.error);
}

function call() {
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  const servers = null;

  callButton.disabled = true;
  hangUpButton.disabled = false;

  // console.log(videoTracks[0].label);

  peerConnection1 = new RTCPeerConnection(servers);
  peerConnection2 = new RTCPeerConnection(servers);

  peerConnection1.onicecandidate = event => onIceCandidate(peerConnection1, event);
  peerConnection2.onicecandidate = event => onIceCandidate(peerConnection2, event);

  peerConnection1.oniceconnectionstatechange = event => onIceStateChange(peerConnection1, event);
  peerConnection2.oniceconnectionstatechange = event => onIceStateChange(peerConnection2, event);

  peerConnection2.ontrack = gotRemoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection1.addTrack(track, localStream);
  });

  return peerConnection1.createOffer(offerOptions)
    .then(onCreateOfferSuccess)
    .catch(console.error);
}

function hangUp() {
  peerConnection1.close();
  peerConnection2.close();
  peerConnection1 = null;
  peerConnection2 = null;
  hangUpButton.disabled = true;
  callButton.disabled = false;
}

callButton.disabled = true;
hangUpButton.disabled = true;

startButton.addEventListener('click', start);
callButton.addEventListener('click', call);
hangUpButton.addEventListener('click', hangUp);
