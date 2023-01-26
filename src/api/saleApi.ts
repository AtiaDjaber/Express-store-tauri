import HttpClient from "./httpClient";
import Sale from "@/classes/sale";
import axiosModule from "@/store/axiosModule";
import { AxiosResponse } from "axios";

export default class SaleApi {
  public getSales(url?: string): Promise<Sale[]> {
    return axiosModule.instance
      .get(url ? "api/sales" + url : "api/sales")
      .then((x) => x.data);
  }

  async saveSale(sale: Sale[]): Promise<Sale[]> {
    return axiosModule.instance.post("api/sale/add", sale).then((x) => x.data);
  }

  static deleteSale(id: number): Promise<any> {
    const deletedFacture = axiosModule.instance
      .delete("api/sale/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updateSale(sale: Sale): Promise<AxiosResponse> {
    return axiosModule.instance.put("api/sale/put", sale).then((x) => x.data);
  }

  static async returnSale(sale: Sale): Promise<AxiosResponse> {
    return axiosModule.instance
      .put("api/sale/return", sale)
      .then((x) => x.data);
  }
}
