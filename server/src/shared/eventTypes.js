// Application-specific events
export const ChatEvent = Object.freeze({
  // Events sent by client
  JOIN_ROOM: 'join',
  MESSAGE_FROM_CLIENT: 'messageFromClient',
  // Events sent by server
  MESSAGE_FROM_SERVER: 'messageFromServer',
  SYSTEM_MESSAGE_FROM_SERVER: 'systemMessageFromServer',
});

// Generic Socket.io-events on the server side
export const ServerEvent = Object.freeze({
  CONNECT: 'connect',
});

// Generic Socket.io-events on the client side
export const ClientEvent = Object.freeze({
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  CONNECT_TIMEOUT: 'connect_timeout',
  ERROR: 'error',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECTING: 'reconnecting',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  PING: 'ping',
  PONG: 'pong',
});
