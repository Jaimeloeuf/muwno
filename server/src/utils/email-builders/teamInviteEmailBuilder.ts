/**
 * Transactional email to invite someone to join a Team/Org.
 */
export const teamInviteEmailBuilder = {
  subject: (inviterName: string, orgName: string) =>
    `${inviterName} invited you to join ${orgName}`,

  body: (
    inviterName: string,
    orgName: string,
  ) => `Hello, this is the robot from <a target="_blank" href="https://muwno.com"><b>muwno</b></a>!
<br /><br />
${inviterName} has invited you to join ${orgName}, click the link to signup for an account to join the team!
<br />
<a target="_blank" href="https://app.muwno.com/signup">https://app.muwno.com/signup</a>`,
};
