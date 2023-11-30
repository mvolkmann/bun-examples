const server = Bun.serve({
  port: 1919,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response('WebSocket upgrade failed', {status: 500});
  },
  websocket: {
    open(ws) {
      console.log('WebSocket opened');
    },
    message(ws, data) {
      console.log('received:', data);
      console.log('type:', typeof data);
      if (typeof data === 'string') {
        console.log('sending response');
        ws.send(data.toUpperCase());
      }
    },
    close(ws, code, reason) {
      console.log(`WebSocket closed with code ${code} and reason "${reason}"`);
    }
  }
});

console.log('WebSocket server is listening on port', server.port);
