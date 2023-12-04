import { defineStore } from "pinia";
import unixseconds from "unixseconds";
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

  /**
   * A map used to track when was the Product Entity objects cached, so if the
   * cached data is too old, it will reload from the API.
   */
  productCacheTime: Record<ProductID, number>;
}

/**
 * Use this 'store' for product data.
 */
export const useProduct = defineStore("product", {
  state: (): State => ({ products: {}, productCacheTime: {} }),

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

      // Return product immediately if user did not ask for a forced refresh,
      // `product` is cached and the cache is still fresh.
      if (
        !forceRefresh &&
        product !== undefined &&
        this.isCachedProductFresh(productID)
      )
        return product;

      const { res, err } = await sf
        .useDefault()
        .GET(`/product/${productID}`)
        .useHeader(getAuthHeader)
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to load Product: ${JSON.stringify(res)}`);

      this.products[productID] = res.data.product;
      this.productCacheTime[productID] = unixseconds();

      return res.data.product;
    },

    /**
     * Check if a cached Product is still fresh (less than 24 hours old).
     * Returns false if the product is not found in the `productCacheTime` map.
     */
    isCachedProductFresh(productID: ProductID) {
      const cacheTime = this.productCacheTime[productID];
      if (cacheTime === undefined) return false;

      // Get Unix Seconds of 24 hours ago
      const oneDayAgo = unixseconds() - 8.64e7;

      // Check if time of cache is newer than the one day old threshold
      return cacheTime > oneDayAgo;
    },

    /**
     * Create a new Product
     */
    async createNewProduct(
      name: Product["name"],
      link: Product["link"],
      description: Product["description"]
    ) {
      const { res, err } = await sf
        .useDefault()
        .POST(`/product`)
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneProductDTO>({ name, link, description })
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to add Product: ${JSON.stringify(res)}`);

      const { product } = res.data;

      this.products[product.id] = product;
      this.productCacheTime[product.id] = unixseconds();

      return product;
    },

    /**
     * Update a Product
     */
    async updateProduct(
      productID: ProductID,
      name: Product["name"],
      link: Product["link"],
      description: Product["description"]
    ) {
      const { res, err } = await sf
        .useDefault()
        .PUT(`/product/${productID}`)
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneProductDTO>({ name, link, description })
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to update Product: ${JSON.stringify(res)}`);

      const { product } = res.data;

      this.products[product.id] = product;
      this.productCacheTime[product.id] = unixseconds();

      return product;
    },

    /**
     * Delete a product and clear it from cache.
     */
    async deleteProduct(productID: ProductID) {
      const { res, err } = await sf
        .useDefault()
        .DEL(`/product/${productID}`)
        .useHeader(getAuthHeader)
        .runJSON();

      if (err) throw err;
      if (!res.ok) throw new Error(`Failed to delete: ${JSON.stringify(res)}`);

      delete this.products[productID];
    },
  },
});
