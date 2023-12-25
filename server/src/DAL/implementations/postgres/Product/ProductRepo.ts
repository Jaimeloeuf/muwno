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
                // Select as little as possible for efficiency
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
      .then((user) => user?.org?.product[0])
      .then(runMapperIfNotNull(mapProductModelToEntity));
  }

  async getProductOrg(id: ProductID) {
    return this.db.product
      .findUnique({
        where: { id },
        select: { org_id: true },
      })
      .then(runMapperIfNotNull((product) => product.org_id));
  }

  async getUserOrgProducts(id: UserID) {
    return (
      this.db.user
        .findUnique({
          where: { id },
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
    id: ProductID,
    org_id: OrgID,
    createOneProductDTO: CreateOneProductDTO,
  ) {
    return this.db.product
      .create({ data: { ...createOneProductDTO, id, org_id } })
      .then(mapProductModelToEntity);
  }

  async update(id: ProductID, data: CreateOneProductDTO) {
    return this.db.product
      .update({ where: { id }, data })
      .then(mapProductModelToEntity);
  }

  async deleteOne(id: ProductID) {
    await this.db.product.delete({ where: { id } });
  }

  async transfer(id: ProductID, org_id: OrgID) {
    await this.db.product.update({ where: { id }, data: { org_id } });
  }
}
