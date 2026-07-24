// OAuth (étape 1) : redirige vers GitHub pour autoriser l'accès au dépôt.
export default async (req) => {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("OAUTH_GITHUB_CLIENT_ID manquant (variable d'env Netlify).", {
      status: 500,
    });
  }
  const gh = new URL("https://github.com/login/oauth/authorize");
  gh.searchParams.set("client_id", clientId);
  gh.searchParams.set("redirect_uri", `${origin}/api/callback`);
  gh.searchParams.set("scope", "repo,user");
  gh.searchParams.set("state", crypto.randomUUID());
  return Response.redirect(gh.toString(), 302);
};
