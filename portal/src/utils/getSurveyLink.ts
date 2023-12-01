import { formLink } from "./links";
import type { ProductID } from "@domain-model";

export const getSurveyLink = (productID: ProductID) =>
  `${formLink}/#/pmf/${productID}`;
