import { defineStore } from "pinia";
import { sf } from "simpler-fetch";
import type {
  Org,
  ReadOneOrgDTO,
  Product,
  Products,
  ReadManyProductDTO,
  CreateOneOrgDTO,
  CreateOneProductDTO,
  ReadOneProductDTO,
} from "domain-model";

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

  /**
   * ID of the currently selected product for viewing
   */
  currentProductID: Product["id"] | undefined;
}

/**
 * Use this 'store' for org data.
 */
export const useOrg = defineStore("org", {
  state: (): State => ({
    orgDetails: undefined,
    products: {},
    currentProductID: undefined,
  }),

  getters: {
    productsArray: (state) => Object.values(state.products),

    /**
     * # ***WARNING***
     *
     * Only use the `Product` object of this getter if you are 1000% sure that
     * the `currentProductID` is set! Since this does type casting to make it
     * easier for store users to access the current Product.
     */
    currentProduct: (state) =>
      state.products[state.currentProductID as Product["id"]] as Product,
  },

  actions: {
    /**
     * Load Org Details of the org the currently logged in user belongs to.
     */
    async loadOrg() {
      const { res, err } = await sf
        .useDefault()
        .GET("/org/self")
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      this.orgDetails = res.data.org;
    },

    /**
     * Create a new Org.
     */
    async createOrg(createOneOrgDTO: CreateOneOrgDTO) {
      const { res, err } = await sf
        .useDefault()
        .POST("/org/create")
        .bodyJSON<CreateOneOrgDTO>(createOneOrgDTO)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to create new Organisation");

      this.orgDetails = res.data.org;
    },

    /**
     * Load all the Products of the user's org
     */
    async loadProducts() {
      const { res, err } = await sf
        .useDefault()
        .GET(`/product/all`)
        .runJSON<ReadManyProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Org data");

      this.products = res.data.products;

      // Set first Product (if avail) as current Product if current Product is not set.
      // If somehow the currentProductID is invalid, choose a new current ProductID to set.
      if (
        this.currentProductID === undefined ||
        this.products[this.currentProductID] === undefined
      ) {
        const product = this.productsArray[0];
        if (product !== undefined) this.setCurrentProduct(product.id);
      } else {
        // If current Product is already set, load current Product data to make sure
        // it is up to date on app launch.
        this.loadCurrentProductData();
      }
    },

    /**
     * Load data / details of current Product using other stores.
     */
    loadCurrentProductData() {
      // @todo Use current Product ID to load data through the other stores.
      this.currentProductID;

      // Call API through other stores to load details of the current Product
      // useItem().loadItems();
      // useCart().loadCart();
      // useWaste().loadWaste();
    },

    /**
     * Set the current Product
     */
    setCurrentProduct(ProductID: Product["id"]) {
      if (!(ProductID in this.products))
        throw new Error("Invalid Product ID used when setting current Product");

      this.currentProductID = ProductID;

      // Load Product data after changing current Product
      this.loadCurrentProductData();
    },

    /**
     * Get Product object of given `ProductID`
     */
    getProduct(ProductID: Product["id"]) {
      const Product = this.products[ProductID];

      if (Product === undefined)
        throw new Error("Invalid Product ID used while loading product");

      return Product;
    },

    /**
     * Create a new Product
     */
    async createNewProduct(product: Pick<Product, "name">) {
      const { res, err } = await sf
        .useDefault()
        .POST(`/product/create`)
        .bodyJSON<CreateOneProductDTO>({ name: product.name, surveyMode: 2 })
        .runJSON<ReadOneProductDTO>();

      if (err) throw err;
      if (!res.ok) throw new Error("Failed to add new product.");

      this.products[res.data.product.id] = res.data.product;

      this.setCurrentProduct(res.data.product.id);
      return this.getProduct(res.data.product.id);
    },
  },

  /**
   * Persist state to localStorage.
   */
  persist: true,
});
