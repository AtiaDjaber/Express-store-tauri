import facture from "@/classes/facture";
import HttpClient from "./httpClient";
import Search from "@/classes/search";
import { Action } from "vuex-class-modules";
import FournisseurFacture from "@/classes/fournisseurFacture";
import Facture from "@/classes/facture";
import axiosModule from "@/store/axiosModule";

export default class historyApi {
  static getFactures(search?: Search): Promise<facture[]> {
    return axiosModule.instance
      .get<facture[]>("api/factures?" + search.toFilter())
      .then((x) => x.data);
  }

  static getFactureClient(id?: any): Promise<Facture> {
    return axiosModule.instance
      .get("api/facture/getByFactureId/" + id)
      .then((x) => x.data);
  }

  static getFactureFournisseur(id?: any) {
    return axiosModule.instance
      .get("api/fournisseur_facture/getByFactureId/" + id)
      .then((x) => {
        console.log(x);
        return x.data;
      });
  }

  static getFourinsseurFactures(search?: Search) {
    return axiosModule.instance
      .get("api/fournisseur_factures?" + search.toFilter())
      .then((x) => x.data);
  }

  static getCommandFourinsseur(search?: Search) {
    return axiosModule.instance
      .get("api/command_fournisseurs?" + search.toFilter())
      .then((x) => x.data);
  }
}
