/**
 * Notify admin about a new User signup.
 */
export const userSignupNotifBuilder = (
  name: string,
  email: string,
  phone?: string,
) => `<b>New user signup</b>

Name: ${name}
Email: ${email}
Phone: ${phone}`;
