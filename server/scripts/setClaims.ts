import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Can only import Type since this is not build with the source code.
import type { Role, CustomClaims } from 'domain-model';

/**
 * Sample CLI use
 *
 * npx ts-node .\setClaims.ts user1@example.com user2@example.com
 */
async function main() {
  const { default: serviceAccount } = await import(
    '../serviceAccountKey.json',
    { assert: { type: 'json' } }
  );

  // @todo wrong casting used
  initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
  const auth = getAuth();

  const setClaimsWithEmail =
    (claims: CustomClaims) => async (userEmail: string) =>
      auth
        .getUserByEmail(userEmail)
        .then(async ({ uid }) => {
          await auth.setCustomUserClaims(uid, claims);
          await auth.revokeRefreshTokens(uid);
          // Use this to manually set emailVerified status
          // await auth.updateUser(uid, { emailVerified: false });
          return auth.getUser(uid);
        })
        .then((user) => console.log(user, user.customClaims))
        .catch(console.error);

  // @todo Modify this to set whatever custom claims that is needed
  const addClaim = setClaimsWithEmail({
    // Must be casted because Role is only imported as a Type here
    roles: ['o-o' as Role],
  });

  Promise.all(process.argv.splice(2).map(addClaim)).then(() =>
    console.log('\n================== completed =================='),
  );
}

main();
