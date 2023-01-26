import Fournisseur from "@/classes/fournisseur";
import FournisseurPayment from "@/classes/fournisseurPayment";
import axiosModule from "@/store/axiosModule";
import HttpClient from "./httpClient";
import Search from "@/classes/search";

export default class FournisseurApi {
  // public constructor() {
  //   super(process.env.VUE_APP_API_URL);
  // }

  public getFournisseurs(url?: string): Promise<Fournisseur[]> {
    return axiosModule.instance
      .get<Fournisseur[]>("api/fournisseurs" + url)
      .then((x) => x.data);
  }

  static getAllFournisseurs(url?: string): Promise<Fournisseur[]> {
    return (
      axiosModule.instance
        // .get<Fournisseur[]>("api/teachers" + url)
        .get<Fournisseur[]>("api/allfournisseurs")
        .then((x) => x.data)
    );
  }

  saveFournisseur(Fournisseur: Fournisseur) {
    const saveFournisseur = axiosModule.instance
      .post<Fournisseur>("api/fournisseur/add", Fournisseur)
      .then((x) => x.data);
    return saveFournisseur;
  }

  updateFournisseur(Fournisseur: Fournisseur) {
    const updateFournisseur = axiosModule.instance
      .put<Fournisseur>("api/fournisseur/put", Fournisseur)
      .then((x) => x.data);
    return updateFournisseur;
  }

  deleteFournisseur(id: number) {
    const deleteFournisseur = axiosModule.instance
      .delete<any>("api/fournisseur/" + id)
      .then((x) => x.data);
    return deleteFournisseur;
  }

  deletePayment(id: number) {
    const deletedFournisseurPayment = axiosModule.instance
      .delete<any>("api/fournisseur_payment/" + id)
      .then((x) => x.data);
    return deletedFournisseurPayment;
  }

  getFournisseurPaymentsById(id: number, page: any) {
    return axiosModule.instance
      .get(
        "api/fournisseur_payments/getByFournisseurId?fournisseur_id=" +
          id +
          "&page=" +
          page
      )
      .then((x) => x.data);
  }

  addPayment(payment: FournisseurPayment): Promise<FournisseurPayment> {
    const savedPayment = axiosModule.instance
      .post<FournisseurPayment>(
        "api/fournisseur_payment/add?price=" +
          payment.price +
          "&fournisseur_id=" +
          payment.fournisseur_id +
          "&date=" +
          payment.date
      )
      .then((x) => x.data);

    return savedPayment;
  }

  getFournisseurfacturesById(search: Search) {
    return axiosModule.instance
      .get("api/fournisseur_factures?" + search.toFilter())
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deleteFacture = axiosModule.instance
      .delete("api/fournisseur_facture/" + id)
      .then((x) => x.data);
    return deleteFacture;
  }
}
