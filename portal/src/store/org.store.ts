import { defineStore } from "pinia";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type {
  Org,
  ReadOneOrgDTO,
  Product,
  ProductID,
  Products,
  ReadManyProductDTO,
  CreateOneOrgDTO,
  CreateOneProductDTO,
  ReadOneProductDTO,
} from "@domain-model";

import { useUserStore } from "./user.store";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Org Details of the org the currently logged in user belongs to.
   * Defaults to undefined if user is not logged in yet or does not have an org.
   */
  orgDetails: Org | undefined;

  /**
   * A mapping of all products of the user's org
   */
  products: Products;
}

/**
 * Use this 'store' for org data.
 */
export const useOrg = defineStore("org", {
  state: (): State => ({
    orgDetails: undefined,
    products: {},
  }),

  getters: {
    productsArray: (state) => Object.values(state.products),
  },

  actions: {
    /**
     * Get Org Details of the org the currently logged in user belongs to. Org
     * details will be cached for the current session till a refresh or if force
     * reload flag passed in.
     */
    async getOrg(forceRefresh = false) {
      // If user did not ask for a forced refresh, and `orgDetails` is already
      // cached, return it immediately.
      if (!forceRefresh && this.orgDetails !== undefined)
        return this.orgDetails;

      const { res, err } = await sf
        .useDefault()
        .GET("/org/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      this.orgDetails = res.data.org;

      return res.data.org;
    },

    /**
     * Create a new Org.
     */
    async createOrg(createOneOrgDTO: CreateOneOrgDTO) {
      const { res, err } = await sf
        .useDefault()
        .POST("/org/create")
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneOrgDTO>(createOneOrgDTO)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to create new Organisation");

      await useUserStore().refreshJWT(true);

      this.orgDetails = res.data.org;
    },

    /**
     * Load all the Products of the user's org
     */
    async loadProducts() {
      const { res, err } = await sf
        .useDefault()
        .GET(`/product/all/self`)
        .useHeader(getAuthHeader)
        .runJSON<ReadManyProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      this.products = res.data.products;
    },

    /**
     * Get Product object of given `ProductID`
     */
    getProduct(ProductID: ProductID) {
      const Product = this.products[ProductID];

      if (Product === undefined)
        throw new Error("Invalid Product ID used while loading product");

      return Product;
    },

    /**
     * Create a new Product
     */
    async createNewProduct(productName: Product["name"]) {
      const { res, err } = await sf
        .useDefault()
        .POST(`/product/create`)
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneProductDTO>({ name: productName })
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to add new product.");

      // Store the product object locally and return it
      const { product } = res.data;
      this.products[product.id] = product;
      return product;
    },
  },

  /**
   * Persist state to localStorage.
   */
  persist: true,
});
