import HttpClient from "./httpClient";
import Facture from "@/classes/facture";
import axiosModule from "@/store/axiosModule";

export default class FactureApi {
  public getFactures(url?: string): Promise<Facture[]> {
    return axiosModule.instance
      .get(url ? "api/factures" + url : "api/factures")
      .then((x) => x.data);
  }

  async saveFacture(facture: Facture): Promise<any> {
    return axiosModule.instance
      .post<Facture>("api/facture/add", facture)
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deletedFacture = axiosModule.instance
      .delete<any>("api/facture/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updateFacture(facture: Facture) {
    return axiosModule.instance
      .put("api/facture/put", facture)
      .then((x) => x.data);
  }

  static paginateFacture(page: number): Promise<Facture[]> {
    return axiosModule.instance
      .get("api/paginateFacture?page=" + page)
      .then((x) => x.data);
  }
}
