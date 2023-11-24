/**
 * Transactional email to thank user for creating an Org and to tell them about
 * any next steps for them.
 */
export const orgDetailsUpdateEmailBuilder = {
  subject: (orgName: string) => `Details updated for ${orgName}`,

  body: (orgName: string) => `Hey admin of ${orgName},
<br />
Someone just updated details of your Organisation. View details in the <a target="_blank" href="https://portal.muwno.com">muwno portal</a>.
<br />
Email us at help@muwno.com if this is not authorised!`,
};
