// Serveur de partie Port Néon — relais WebSocket par salle (Cloudflare Worker + Durable Object)
// Chaque salle est un Durable Object : il reçoit les messages d'un joueur et les renvoie aux autres.

export class Room {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    if (typeof message !== 'string' || message.length > 8000) return;
    for (const other of this.state.getWebSockets()) {
      if (other !== ws) {
        try { other.send(message); } catch (e) { /* joueur déjà parti */ }
      }
    }
  }

  webSocketClose(ws, code) {
    try { ws.close(code, 'au revoir'); } catch (e) { /* déjà fermé */ }
  }

  webSocketError(ws) {
    try { ws.close(1011, 'erreur'); } catch (e) { /* déjà fermé */ }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Serveur Port Néon : OK', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const room = (url.searchParams.get('room') || 'public').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32) || 'public';
    const stub = env.ROOMS.get(env.ROOMS.idFromName(room));
    return stub.fetch(request);
  },
};
