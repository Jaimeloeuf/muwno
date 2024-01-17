/**
 * Transactional email to thank user for creating an Org and to tell them about
 * any next steps for them.
 */
export const orgDetailsUpdateEmailBuilder = {
  subject: (orgName: string) => `Details updated for ${orgName}`,

  body: (orgName: string) => `Hey admin of ${orgName},
<br />
Someone just updated details of your Organisation. See details in <a target="_blank" href="https://app.muwno.com">app.muwno.com</a>.
<br />
Email us at help@muwno.com if this is not authorised!`,
};
