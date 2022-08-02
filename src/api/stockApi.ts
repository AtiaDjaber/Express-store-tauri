import Stock from "@/classes/stock";
import HttpClient from "./httpClient";
import Search from "@/classes/search";

export default class stockApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public async getStock(search?: Search): Promise<any> {
    return await this.instance.get("api/products?" + search.toFilter());
  }

  public async getProductyDepot(search?: Search): Promise<any> {
    return await this.instance.get("api/product_depot?" + search.toFilter());
  }

  async saveStock(stock: Stock): Promise<any> {
    return await this.instance.post("api/product/add", stock);
  }

  async saveManyStock(stock: Stock[]): Promise<any> {
    return await this.instance.post("api/product/add_many", stock);
  }
  

  deleteStock(id: number) {
    
    const deleteStock = this.instance
      .delete<any>("api/product/" + id)
      .then((x) => x.data);
    return deleteStock;
  }

  async updateStock(stock: Stock) {
    return this.instance.put<Stock>("api/product/put", stock);
  }
}
