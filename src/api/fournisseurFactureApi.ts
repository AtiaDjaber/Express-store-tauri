import CommandFournisseur from "@/classes/CommandFournisseur";
import FournisseurFacture from "@/classes/fournisseurFacture";
import axiosModule from "@/store/axiosModule";

export default class FournisseurFactureApi {
  public getFactures(url?: string): Promise<FournisseurFacture[]> {
    return axiosModule.instance
      .get(url ? "api/fournisseur_facture" + url : "api/fournisseur_facture")
      .then((x) => x.data);
  }

  async saveFacture(facture: FournisseurFacture): Promise<any> {
    return axiosModule.instance
      .post("api/fournisseur_facture/add", facture)
      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deletedFacture = axiosModule.instance
      .delete<any>("api/fournisseur_facture/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }

  static deleteCommand(id: number) {
    const deletedFacture = axiosModule.instance
      .delete<any>("api/command_fournisseur/" + id)
      .then((x) => x.data);
    return deletedFacture;
  }
  async updateFacture(facture: FournisseurFacture) {
    return axiosModule.instance
      .put("api/fournisseur_facture/put", facture)
      .then((x) => x.data);
  }

  async saveCommandFournisseur(facture: CommandFournisseur): Promise<any> {
    return axiosModule.instance
      .post("api/command_fournisseur/add", facture)
      .then((x) => x.data);
  }
}
