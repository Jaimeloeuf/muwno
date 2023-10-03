import { Injectable } from '@nestjs/common';

import type { IProductRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type {
  OrgID,
  UserID,
  ProductID,
  CreateOneProductDTO,
} from 'domain-model';

// Mappers
import { mapProductModelToEntity, mapProductModelsToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class ProductRepo implements IProductRepo {
  constructor(private readonly db: PrismaService) {}

  async productExists(productID: ProductID) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { id: true }, // Select as little as possible for efficiency
      })
      .then((product) => product !== null);
  }

  async canUserAccessProduct(userID: UserID, productID: ProductID) {
    // Load all products that the user can access that has this product ID.
    // Alternative method is to start search by product -> org -> user.
    return this.db.user
      .findUnique({
        where: { id: userID },

        select: {
          org: {
            select: {
              product: {
                where: { id: productID },
                select: { id: true },
              },
            },
          },
        },
      })
      .then((user) => user?.org?.product)
      .then((products) => products !== undefined);
  }

  async getProduct(userID: UserID, productID: ProductID) {
    // Load product with productID only if user can access it.
    return this.db.user
      .findUnique({
        where: { id: userID },

        select: {
          org: {
            select: {
              product: {
                where: { id: productID },
              },
            },
          },
        },
      })
      .then((user) => user?.org?.product)
      .then(runMapperIfNotNull((products) => products[0]))
      .then(runMapperIfNotNull(mapProductModelToEntity));
  }

  async getOrgProducts(org_id: OrgID) {
    return this.db.product
      .findMany({ where: { org_id }, orderBy: { created_at: 'asc' } })
      .then(mapProductModelsToEntity);
  }

  async getUserOrgProducts(userID: UserID) {
    return (
      this.db.user
        .findUnique({
          where: { id: userID },
          select: {
            org: {
              select: {
                product: {
                  orderBy: { created_at: 'desc' },
                },
              },
            },
          },
        })
        // Default to an empty array to denote Org with no products
        .then((user) => mapProductModelsToEntity(user?.org?.product ?? []))
    );
  }

  async createOne(
    id: string,
    org_id: OrgID,
    createOneProductDTO: CreateOneProductDTO,
  ) {
    return this.db.product
      .create({ data: { ...createOneProductDTO, id, org_id } })
      .then(mapProductModelToEntity);
  }

  async deleteOne(productID: ProductID) {
    await this.db.product.delete({ where: { id: productID } });
  }
}
