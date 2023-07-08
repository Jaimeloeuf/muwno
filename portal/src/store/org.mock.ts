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
    currentSprint: 143,
    samplingDetails: { rate: 1, size: 100, maxSampleCount: 1, coolOff: 4 },
  },
  [grp2ID]: {
    id: grp2ID,
    createdAt: generateIsoDateTimeString(-246400000),
    name: "HB30",
    score: 43,
    currentSprint: 2,
    samplingDetails: { rate: 3, size: 5, maxSampleCount: 1, coolOff: 4 },
  },
  [grp3ID]: {
    id: grp3ID,
    createdAt: generateIsoDateTimeString(-246400000),
    name: "HAS",
    score: 28,
    currentSprint: 12,
    samplingDetails: { rate: 5, size: 100, maxSampleCount: 1, coolOff: 4 },
  },
};

export const mockProducts = products;
// export const mockProducts = {};
