import type { SurveyMethod } from "../SurveyMethod.js";

export const ManualEmailBlast: SurveyMethod = {
  id: 1,
  name: "Manual Email Blasts",
  productType: "Software as a Service (SaaS)",
  productExamples: ["Spotify", "Netflix", "Instagram"],
  usecase: [
    "If you do have your customer's emails but do not want to automatically survey them, you can also use this to do one-off survey blasts by manually uploading your customers' email.",
  ],
  descriptions: [
    "You can do one-off email survey blasts by manually uploading your customers' email.",
  ],
};
