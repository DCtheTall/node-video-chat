# node-video-chat
A working web RTC video and text chat.

# Currently experiencing NaT issues, but it is possible this is because I used a self-signed certificate to build this.

A simple MV node server that serves a video chat React app.

### Needs an SSL certificate and key to work
Look at `bin/www.js` to see how the app uses the cryptographic info to create an HTTPS server.

To install run `npm install`
Run `npm start`

To get front-end code ready for browser run Webpack
