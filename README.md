# Node.js Video Chat

You can try out a live demo [here](https://dcthetall-video-chat.herokuapp.com)!

A video chat written in JavaScript using React, Node.js, GraphQL, and Socket.io.
This app is entirely in-browser.

Features include:
- User authentication system with JWT
- Users can upload profile pictures which are stored in S3
- Real time updates with GraphQL subscriptions
- Instant messaging using GraphQL subscriptions
- Peer to peer video chat using WebRTC and Socket.io

The back end is comprised of 4 servers:
- A PostgreSQL server as the primary database
- A GraphQL API with Redis-backed subscriptions
- A socket.io server for signaling calls
- A Redis server backing the publisher/subscriber for GraphQL subscriptions

The front end (served from the GraphQL server for SSR) uses React and Apollo
to interface with the GraphQL API. It also contains a Redux store containing
the video chat state and thunk actions which interact with the Socket.io server
for signaling.

The app uses Twilio for STUN/TURN servers but I may use available Node.js libraries
to implement that myself in the future.

#### Environmental variables:
- `APP_NAME` determines which server to start when running the app
- `PORT` determines which port the server is listening on
- `NODE_ENV` determines environment (`production` or `development`)
- `SIGNAL_SERVER_URL` URL of socket.io server
- `AWS_ACCESS_KEY` for S3 where profile pictures are kept
- `AWS_SECRET_KEY` for S3
- `AWS_BUCKET` bucket where profile pictures are stored
- `COOKIE_KEY` encryption key for setting cookies for session auth
- `COOKIE_SECRET` secret for setting cookies for session auth
- `DATABASE_NAME` of Postgres database
- `DATABASE_HOST` for Postgres
- `DATABASE_USER` Postgres role
- `DATABASE_PASSWORD` for Postgres
- `GRAPHQL_URI` URI of GraphQL server
- `GRAPHQL_WS_URI` WebSocket URI for GraphQL subscriptions
- `JWT_SECRET` JWT encryption secret
- `REDISCLOUD_URL` URI of Redis database
- `TWILIO_AUTH_TOKEN` token for Twilio account (for STUN/TURN)
- `TWILIO_SID` Twilio account SID


