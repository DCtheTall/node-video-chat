import * as React from "react";
import { connect } from "react-redux";

import { setStatus } from "../actions";

function Disconnected({ setStatus }) {
  return (
    <div className="disconnected">
      It seems your friend disconnected.
      <br />
      <button
        className="restart-btn"
        onClick={() => setStatus('prompting')}
      >
        Restart
      </button>
    </div>
  );
}

const SmartDisconnected = connect(null, { setStatus })(Disconnected);

export default SmartDisconnected;
