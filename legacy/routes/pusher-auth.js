"use strict";

let Pusher = require('pusher');

module.exports = function(req, res) {
  let pusher = new Pusher({ appId: process.env.PUSHER_APP_ID,
                            key: process.env.PUSHER_KEY,
                            secret: process.env.PUSHER_SECRET })
    , socketid = req.body.socket_id
    , channel = req.body.channel_name
    , auth = pusher.authenticate(socketid, channel, { user_id: req.query.id, user_info: { name: 'Dylan' } });
  res.send(auth);
}
