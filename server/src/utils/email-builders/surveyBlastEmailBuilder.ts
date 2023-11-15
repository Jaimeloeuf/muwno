export const surveyBlastEmailBuilder = {
  subject: (name: string | null, productName: string) =>
    `Hi ${
      name ?? 'there'
    }, how would you feel if ${productName} no longer exists?`,

  body: (name: string | null, productName: string, surveyLink: string) => `Hi ${
    name ?? 'there'
  },
<br /><br />
How would you feel if ${productName} no longer exists?
<br /><br />
${surveyLink}`,
};
