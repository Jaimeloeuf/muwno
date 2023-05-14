import type { Survey } from "../../../../server/src/survey/SurveyValidator";

export const survey: Survey = {
  schemaVersion: "1",

  // base on this look, everything can be in SQL cols except ques which will be a jsonb
  // and thats fine anyways since it is not going to be indexed
  id: "123",
  idOfPreviousVersion: undefined,
  createdAt: new Date().toISOString(),
  createdBy: "superhuman@gmail.com or some userID",
  ownedBy: "superhuman-ownerID",
  title: "Super Human feedback form",
  ques: [
    {
      type: "option",
      ques: "How would you feel if you could no longer use the product?",
      optional: false,
      options: [
        "Very disappointed",
        "Somewhat disappointed",
        "Not disappointed",
      ],
    },
    {
      type: "long-text",
      ques: "What type of people do you think would most benefit from Superhuman?",
      optional: true,
      charLimit: 1000,
    },
    {
      type: "long-text",
      ques: "What is the main benefit you receive from Superhuman?",
      optional: true,
      charLimit: 1000,
    },
    {
      type: "long-text",
      ques: "How can we improve Superhuman for you?",
      optional: true,
      charLimit: 1000,
    },
  ],
};
