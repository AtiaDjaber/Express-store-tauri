import HttpClient from "./httpClient";
import Facture from "@/classes/facture";

export default class FactureApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public getFactures(url?: string): Promise<Facture[]> {
    return this.instance
      .get(url ? "api/factures" + url : "api/factures")
      .then((x) => x.data);
  }


  async saveFacture(facture: Facture): Promise<any> {
    return this.instance
      .post<Facture>("api/facture/add", facture)
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deletedFacture = this.instance
      .delete<any>("api/facture/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updateFacture(facture: Facture) {
    return this.instance.put("api/facture/put", facture).then((x) => x.data);
  }
}
