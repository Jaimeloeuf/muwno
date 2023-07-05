import type { Products } from "../types";
import { generateIsoDateTimeString, generateRandomID } from "./mock.utils";

const grp1ID = generateRandomID();
const grp2ID = generateRandomID();
const grp3ID = generateRandomID();

/**
 * Mock Products data expected from API server
 */
const products: Products = {
  [grp1ID]: {
    id: grp1ID,
    createdAt: generateIsoDateTimeString(-246400000),
    name: "Superhuman",
    score: 60,
  },
  [grp2ID]: {
    id: grp2ID,
    createdAt: generateIsoDateTimeString(-246400000),
    name: "HB30",
    score: 43,
  },
  [grp3ID]: {
    id: grp3ID,
    createdAt: generateIsoDateTimeString(-246400000),
    name: "HAS",
    score: 28,
  },
};

export const mockProducts = products;
// export const mockProducts = {};
