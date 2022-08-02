import HttpClient from "./httpClient";
import Sale from "@/classes/sale";

export default class SaleApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public getSales(url?: string): Promise<Sale[]> {
    return this.instance
      .get(url ? "api/sales" + url : "api/sales")
      .then((x) => x.data);
  }



  async saveSale(sale: Sale[]): Promise<Sale[]> {
    return this.instance.post("api/sale/add", sale).then((x) => x.data);
  }

  deleteSale(id: number) {
    const deletedFacture = this.instance
      .delete<any>("api/sale/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updateSale(sale: Sale) {
    return this.instance.put("api/sale/put", sale).then((x) => x.data);
  }

  async returnSale(sale: Sale) {
    return this.instance.put("api/sale/return", sale).then((x) => x.data);
  }
}
