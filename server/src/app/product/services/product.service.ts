import { Injectable } from '@nestjs/common';

// Entity Types
import type { Products } from 'domain-model';

@Injectable()
export class ProductService {
  /**
   * Get all products of an Org.
   */
  async getOrgProducts(orgID: string): Promise<Products> {
    /* @todo Remove hardcoded mock data */

    orgID;

    /**
     * Utility for generating ISODateTime strings
     */
    const generateIsoDateTimeString = (differenceInMilliseconds = 0) =>
      new Date(new Date().getTime() + differenceInMilliseconds).toISOString();

    /**
     * Utility for generating random strings to mock IDs
     */
    const generateRandomID = () =>
      (Math.random() + 1).toString(36).substring(2);

    const grp1ID = generateRandomID();
    const grp2ID = generateRandomID();
    const grp3ID = generateRandomID();

    return <Products>{
      [grp1ID]: {
        id: grp1ID,
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'Superhuman',
        score: 60,
        currentSprint: 143,
        samplingDetails: { rate: 1, size: 100, maxSampleCount: 1, coolOff: 4 },
      },
      [grp2ID]: {
        id: grp2ID,
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'theprodtool',
        score: 43,
        currentSprint: 2,
        samplingDetails: { rate: 3, size: 5, maxSampleCount: 1, coolOff: 4 },
      },
      [grp3ID]: {
        id: grp3ID,
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'HAS',
        score: 28,
        currentSprint: 12,
        samplingDetails: { rate: 5, size: 100, maxSampleCount: 1, coolOff: 4 },
      },
    };
  }
}
