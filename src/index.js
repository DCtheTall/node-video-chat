const errorMsg = document.getElementById('error-msg');
const video = document.querySelector('video');

const constraints = window.constraints = {
  video: true,
  audio: false,
};

function handleSuccess(stream) {
  const videoTracks = stream.getVideoTracks();
  window.stream = stream;
  video.srcObject = stream;
  video.play();
}

function showError(msg, err) {
  errorMsg.innerHTML += `<p> ${msg} </p>`;
  if (err) console.error(err);
}

function handleError(err) {
  if (err.name === 'ConstraintNotSatisfiedError') {
    showError('This resolution is not supported by your device');
  } else if (err.name === 'PermissionDeniedError') {
    showError('Permission has not been granted to use the camera');
  }
  showError('Error: ', err);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
