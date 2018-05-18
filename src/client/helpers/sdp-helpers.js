/*

Session Description Protocol helpers
Source: https://bitbucket.org/webrtc/codelab/src/fc1f8b8b5e8733ac793d2ecadcc9f6057a212d5c/complete/step6/js/main.js?at=master&fileviewer=file-view-default

*/

/**
 * @param {string} sdpLine from description
 * @param {RegExp} pattern to match on
 * @returns {string} SDP string
 */
export function extractSdp(sdpLine, pattern) {
  const result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}

/**
 * Set the selected codec to the first in m line.
 *
 * @param {string} mLine of sdp
 * @param {string} payload opus payload
 * @returns {string} mLine with payload inserted first in m line
 */
export function setDefaultCodec(mLine, payload) {
  const elements = mLine.split(' ');
  const newLine = [];
  let index = 0;
  for (let i = 0; i < elements.length; i += 1) {
    if (index === 3) { // Format of media starts from the fourth.
      index += 1;
      newLine[index] = payload; // Put target payload to the first.
    }
    if (elements[i] !== payload) {
      index += 1;
      newLine[index] = elements[i];
    }
  }
  return newLine.join(' ');
}


/**
 * Strip CN from sdp before CN constraints is ready.
 *
 * @param {Array<string>} sdpLines from description
 * @param {number} mLineIndex in lines
 * @returns {Array<string>} stripped sdp
 */
export function removeCN(sdpLines, mLineIndex) {
  const mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (let i = sdpLines.length - 1; i >= 0; i -= 1) {
    const payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      const cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }
  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}


/**
 * Sets opus as the default audio codec
 * https://en.wikipedia.org/wiki/Opus_(audio_format)
 *
 * @param {string} sdp from WebRTC session description
 * @returns {string} sdp with opus encoding
 */
export function preferOpus(sdp) {
  let sdpLines = sdp.split('\r\n');
  let mLineIndex;
  // Search for m line
  for (let i = 0; i < sdpLines.length; i += 1) {
    if (sdpLines[i].includes('m=audio')) {
      mLineIndex = i;
      break;
    }
  }
  if (mLineIndex === undefined) {
    return sdp;
  }
  // If Opus is availbble, set it as the default in m line
  for (let i = 0; i < sdpLines.length; i += 1) {
    if (sdpLines[i].includes('opus/48000')) {
      const opusPayload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
      if (opusPayload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
      }
      break;
    }
  }
  // Remove CN in m line and sdp.
  sdpLines = removeCN(sdpLines, mLineIndex);
  sdp = sdpLines.join('\r\n');
  return sdp;
}
