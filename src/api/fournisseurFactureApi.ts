import HttpClient from "./httpClient";
import FournisseurFacture from "@/classes/fournisseurFacture";

export default class FournisseurFactureApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public getFactures(url?: string): Promise<FournisseurFacture[]> {
    return this.instance
      .get(url ? "api/fournisseur_facture" + url : "api/fournisseur_facture")
      .then((x) => x.data);
  }

  async saveFacture(facture: FournisseurFacture): Promise<any> {
    return this.instance
      .post("api/fournisseur_facture/add", facture)
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deletedFacture = this.instance
      .delete<any>("api/fournisseur_facture/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  async updateFacture(facture: FournisseurFacture) {
    return this.instance
      .put("api/fournisseur_facture/put", facture)
      .then((x) => x.data);
  }
}
