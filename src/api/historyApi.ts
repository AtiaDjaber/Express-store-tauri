import facture from "@/classes/facture";
import HttpClient from "./httpClient";
import Search from "@/classes/search";
import { Action } from "vuex-class-modules";
import FournisseurFacture from "@/classes/fournisseurFacture";
import Facture from "@/classes/facture";

export default class historyApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }
  public getFactures(search?: Search): Promise<facture[]> {
    return this.instance
      .get<facture[]>("api/factures?" + search.toFilter())
      .then((x) => x.data);
  }

  public getFacture(id?: any): Promise<Facture> {
    return this.instance
        .get( "api/facture/getByFactureId/" + id)
        .then((x) => x.data);
  }


  public getFourinsseurFactures(
    search?: Search
  ): Promise<FournisseurFacture[]> {
    return this.instance
      .get("api/fournisseur_factures?" + search.toFilter())
      .then((x) => x.data);
  }
}
