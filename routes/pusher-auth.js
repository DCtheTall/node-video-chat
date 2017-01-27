"use strict";

let Pusher = require('pusher');

module.exports = function(req, res) {
  let pusher = new Pusher({ appId: "284082",
                            key: "b5ee32e8c6b0d68d380b",
                            secret: "fe2f3401057cccce8b94" })
    , socketid = req.body.socket_id
    , channel = req.body.channel_name
    , auth = pusher.authenticate(socketid, channel, { user_id: req.query.id, user_info: { name: 'Dylan' } });
  res.send(auth);
}
