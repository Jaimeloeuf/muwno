import { createAuth0 } from "@auth0/auth0-vue";

export const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: { redirect_uri: window.location.origin },
});

/**
 * Get authentication header if user is authenticated.
 */
export const getAuthHeader = async () => ({
  Authorization: `Bearer ${await auth0.getAccessTokenSilently()}`,
});
