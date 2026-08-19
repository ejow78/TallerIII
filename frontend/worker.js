export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Intentar servir el recurso estático desde el binding ASSETS
    let response = await env.ASSETS.fetch(request);
    
    // Soporte SPA: Si no existe (404), servir index.html para que React Router maneje la ruta
    if (response.status === 404) {
      const indexRequest = new Request(new URL("/index.html", request.url), request);
      response = await env.ASSETS.fetch(indexRequest);
    }
    
    return response;
  }
};
