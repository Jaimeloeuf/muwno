export const createInviteTeamMemberEmailMessage = (
  inviterName: string,
  teamName: string,
) =>
  `Hello, this is the robot from <a target="_blank" href="https://thepmftool.com"><b>thepmftool</b></a>!

${inviterName} has invited you to join ${teamName}!

Click the link to signup for an account to join the team!

<a target="_blank" href="https://portal.thepmftool.com/#/signup">https://portal.thepmftool.com/#/signup</a>`;
