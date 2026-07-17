// OAuth (étape 2) : échange le code GitHub contre un token et le renvoie au CMS.
export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  let body, status;
  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await resp.json();
    if (data.access_token) {
      status = "success";
      body = JSON.stringify({ token: data.access_token, provider: "github" });
    } else {
      status = "error";
      body = JSON.stringify(data);
    }
  } catch (e) {
    status = "error";
    body = JSON.stringify({ error: String(e) });
  }

  // Handshake attendu par Decap/Sveltia CMS via window.postMessage
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<p>Connexion en cours…</p>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage('authorization:github:${status}:${body.replace(/</g, "")}', e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener && window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
