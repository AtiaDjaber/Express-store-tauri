export default class Search {
  name?: string = "";
  url?: string = "";
  from?: string = null;
  to?: string;
  client_id?: number = null;
  box_id?: number = null;
  fournisseur_id?: number = null;
  depot_id?: number = null;
  isPresent?: boolean;
  type?: string = null;

  public toFilter(): string {
    return (
      "page=" +
      (this.url ? this.url : "1") +
      "&name=" +
      (this.name ? this.name : "") +
      "&from=" +
      (this.from ? this.from : "") +
      "&to=" +
      (this.to ? this.to : "") +
      "&client_id=" +
      (this.client_id ? this.client_id : "") +
      "&fournisseur_id=" +
      (this.fournisseur_id ? this.fournisseur_id : "") +
      "&type=" +
      (this.type ? this.type : "export") +
      "&depot_id=" +
      (this.depot_id ? this.depot_id : "") +
      "&box_id=" +
      (this.box_id ? this.box_id : "")
    );
  }
}
