/**
 * Transactional email to thank user for creating an Org and to tell them about
 * any next steps for them.
 */
export const orgCreatedEmailBuilder = {
  subject: (orgName: string) => `Hey ${orgName}, welcome to muwno!`,

  body: (orgName: string) => `Hey ${orgName},
<br />
Welcome to <a target="_blank" href="https://muwno.com"><b>muwno</b></a>!
You are now a part of the community of business owners, product managers, marketers and tech leads who are bringing their products to Product Market Fit.
<br /><br />
Enjoy the journey to Product Market Fit by learning what your customers would pay for!
<br />
Email us at help@muwno.com for anything you need help with!`,

  // @todo add to the Message Body once we have these
  // Here are some tips to get you started:
  // 1. <a target="_blank" href="https://muwno.com">Find out which Surveying Mode suits your needs the best with our quiz.</a>
  // 2. <a target="_blank" href="https://muwno.com">Learn how to import your customers' emails into <b>muwno</b>.</a>
  // 3. <a target="_blank" href="https://muwno.com">Learn about Auto Survey Mode settings.</a>
};
