import client from "@/classes/client";
import snackBarModule from "@/store/snackBarModule";
import HttpClient from "./httpClient";
import ClientPayment from "@/classes/clientPayment";
import Client from "@/classes/client";

export default class clientApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL);
  }

  public getClients(url?: string): Promise<client[]> {
    return this.instance.get<client[]>("api/clients" + url).then((x) => x.data);
  }

  public getAllClients(url?: string): Promise<Client[]> {
    return (
      this.instance
        // .get<Client[]>("api/teachers" + url)
        .get<client[]>("api/allclients")
        .then((x) => x.data)
    );
  }

  saveClient(Client: client) {
    const saveClient = this.instance
      .post<client>("api/client/add", Client)
      .then((x) => x.data);
    return saveClient;
  }

  updateClient(client: client) {
    const updateClient = this.instance
      .put<Client>("api/client/put", client)
      .then((x) => x.data);
    return updateClient;
  }

  deleteClient(id: number) {
    const deleteClient = this.instance
      .delete<any>("api/client/" + id)
      .then((x) => x.data);
    return deleteClient;
  }

  deletePayment(id: number) {
    const deletedClientPayment = this.instance
      .delete<any>("api/client_payment/" + id)
      .then((x) => x.data);
    return deletedClientPayment;
  }

  getClientPaymentsById(id: number, page: any) {
    return this.instance
      .get("api/client_payments/getByClientId?client_id=" + id + "&page=" + page)
      .then((x) => x.data);
  }

  addPayment(payment: ClientPayment) {
    const savedPayment = this.instance
      .post<ClientPayment>("api/client_payment/add?price=" +
          payment.price +
          "&client_id=" +
          payment.client_id +
          "&date=" +
          payment.date
      )
      .then((x) => x.data);

    return savedPayment;
  }

  getClientFactures(id: number, page: any) {
    return this.instance
      .get("api/factures/getByClientId?client_id=" + id + "&page=" + page)

      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deleteFacture = this.instance
      .delete<any>("api/facture/" + id)
      .then((x) => x.data);
    return deleteFacture;
  }
}
