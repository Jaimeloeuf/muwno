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
   * A map used to cache Product Entity objects once they are loaded.
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
     * Get all Products of the user's org
     */
    async getAllProducts() {
      const { res, err } = await sf
        .useDefault()
        .GET(`/product/all/self`)
        .useHeader(getAuthHeader)
        .runJSON<ReadManyProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      // Also caches this fully as a nice side effect
      this.products = res.data.products;

      return Object.values(res.data.products);
    },

    /**
     * Get Product, it will be cached for the current session till a refresh or
     * if force reload flag passed in.
     */
    async getProduct(productID: ProductID, forceRefresh = false) {
      const product = this.products[productID];

      // If user did not ask for a forced refresh, and `product` is already
      // cached, return it immediately.
      if (!forceRefresh && product !== undefined) return product;

      const { res, err } = await sf
        .useDefault()
        .GET(`/product/${productID}`)
        .useHeader(getAuthHeader)
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      this.products[productID] = res.data.product;

      return res.data.product;
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
