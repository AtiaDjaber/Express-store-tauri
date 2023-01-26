import HttpClient from "./httpClient";
import Purchase from "@/classes/purchase";
import axiosModule from "@/store/axiosModule";
import { AxiosResponse } from "axios";

export default class PurchaseApi {
  public getPurchases(url?: string): Promise<Purchase[]> {
    return axiosModule.instance
      .get(url ? "api/purchases" + url : "api/purchases")
      .then((x) => x.data);
  }

  async savePurchase(purchase: Purchase[]): Promise<Purchase[]> {
    return axiosModule.instance
      .post("api/purchase/add", purchase)
      .then((x) => x.data);
  }

  deletePurchase(id: number): Promise<any> {
    const deletedFacture = axiosModule.instance
      .delete("api/purchase/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updatePurchase(purchase: Purchase): Promise<AxiosResponse> {
    return axiosModule.instance
      .put("api/purchase/put", purchase)
      .then((x) => x.data);
  }

  static async returnPurchase(purchase: Purchase): Promise<AxiosResponse> {
    return axiosModule.instance
      .put("api/purchase/return", purchase)
      .then((x) => x.data);
  }
}
