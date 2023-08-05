import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { default as serviceAccount } from '../serviceAccountKey.json' assert { type: 'json' };

import { Role } from 'domain-model';

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();

const setClaimsWithEmail = (claims) => async (userEmail) =>
  auth
    .getUserByEmail(userEmail)
    .then(async ({ uid }) => {
      await auth.setCustomUserClaims(uid, claims);
      await auth.revokeRefreshTokens(uid);
      return auth.getUser(uid);
    })
    .then((user) => console.log(user, user.customClaims.admin)) // Might be too verbose
    .catch(console.error);

// @todo Modify this to set whatever custom claims that is needed
const addClaim = setClaimsWithEmail({
  roles: [Role.OrgUser],
});

/* Expected sample input from CLI: node .\setClaims.js user1@example.com user2@example.com */
Promise.all(process.argv.splice(2).map(addClaim)).then(() =>
  console.log('complete'),
);
