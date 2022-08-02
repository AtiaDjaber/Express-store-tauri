import Fournisseur from "@/classes/fournisseur";
import FournisseurPayment from "@/classes/fournisseurPayment";
import HttpClient from "./httpClient";

export default class FournisseurApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL);
  }

  public getFournisseurs(url?: string): Promise<Fournisseur[]> {
    return this.instance
      .get<Fournisseur[]>("api/fournisseurs" + url)
      .then((x) => x.data);
  }

  public getAllFournisseurs(url?: string): Promise<Fournisseur[]> {
    return (
      this.instance
        // .get<Fournisseur[]>("api/teachers" + url)
        .get<Fournisseur[]>("api/allfournisseurs")
        .then((x) => x.data)
    );
  }

  saveFournisseur(Fournisseur: Fournisseur) {
    const saveFournisseur = this.instance
      .post<Fournisseur>("api/fournisseur/add", Fournisseur)
      .then((x) => x.data);
    return saveFournisseur;
  }

  updateFournisseur(Fournisseur: Fournisseur) {
    const updateFournisseur = this.instance
      .put<Fournisseur>("api/fournisseur/put", Fournisseur)
      .then((x) => x.data);
    return updateFournisseur;
  }

  deleteFournisseur(id: number) {
    const deleteFournisseur = this.instance
      .delete<any>("api/fournisseur/" + id)
      .then((x) => x.data);
    return deleteFournisseur;
  }

  deletePayment(id: number) {
    const deletedFournisseurPayment = this.instance
      .delete<any>("api/fournisseur_payment/" + id)
      .then((x) => x.data);
    return deletedFournisseurPayment;
  }

  getFournisseurPaymentsById(id: number, page: any) {
    return this.instance
      .get(
        "api/fournisseur_payments/getByFournisseurId?fournisseur_id=" +
          id +
          "&page=" +
          page
      )
      .then((x) => x.data);
  }

  addPayment(payment: FournisseurPayment): Promise<FournisseurPayment> {
    const savedPayment = this.instance
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

  getFournisseurfacturesById(id: number, page: any) {
    return this.instance
      .get(
        "api/fournisseur_factures/getByFournisseurId?fournisseur_id=" +
          id +
          "&page=" +
          page
      )
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deleteFacture = this.instance
      .delete<any>("api/fournisseur_facture/" + id)
      .then((x) => x.data);
    return deleteFacture;
  }
}
