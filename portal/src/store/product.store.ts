import { defineStore } from "pinia";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type {
  Product,
  ProductID,
  Products,
  ReadManyProductDTO,
  CreateOneProductDTO,
  ReadOneProductDTO,
} from "@domain-model";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * A map used to cache Product Entity objects once they are loaded.
   */
  products: Products;
}

/**
 * Use this 'store' for product data.
 */
export const useProduct = defineStore("product", {
  state: (): State => ({ products: {} }),

  actions: {
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
      if (!res.ok)
        throw new Error(`Failed to load All Products: ${JSON.stringify(res)}`);

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
      if (!res.ok)
        throw new Error(`Failed to load Product: ${JSON.stringify(res)}`);

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
      if (!res.ok)
        throw new Error(`Failed to add Product: ${JSON.stringify(res)}`);

      // Store the product object locally and return it
      const { product } = res.data;
      this.products[product.id] = product;
      return product;
    },
  },
});
