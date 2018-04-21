const P2P = require('socket.io-p2p');
const io = require('socket.io-client');
const Promise = require('bluebird');

const AudioContext = window.AudioContext || window.webkitAudioContext;
const socket = io();
const p2pSocket = new P2P(socket);
const startButton = document.getElementById('start-stream');

p2pSocket.on('start-stream', () => {
  p2p.usePeerConnection = true;
  startButton.setAttribute('disabled', true);
});

p2pSocket.on('stream', (stream) => {
  const audio = document.querySelector('audio');
  audio.src = window.URL.createObjectURL(stream);
  audio.play();
});

const getUserMedia = () =>
  new Promise((resolve, reject) =>
    navigator.getUserMedia({ audio: true }, resolve, reject));

async function startStream() {
  try {
    const stream = await getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();
    const socket = io();
    const p2pSocket = new P2P(socket, { peerOpts: { stream: destination.stream } });

    source.connect(destination);
    p2psocket.on('ready', () => p2pSocket.usePeerConnection = true);
    p2pSocket.emit('ready', { peerId: p2pSocket.peerId });
  } catch (err) {
    console.error(err);
  }
}

startButton.addEventListener('click', startStream);
