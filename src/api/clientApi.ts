import client from "@/classes/client";
import snackBarModule from "@/store/snackBarModule";
import HttpClient from "./httpClient";
import ClientPayment from "@/classes/clientPayment";
import Client from "@/classes/client";
import axiosModule from "@/store/axiosModule";
import Search from "@/classes/search";

export default class clientApi {
  public getClients(url?: string): Promise<client[]> {
    return axiosModule.instance
      .get<client[]>("api/clients" + url)
      .then((x) => x.data);
  }

  public getAllClients(url?: string): Promise<Client[]> {
    return (
      axiosModule.instance
        // .get<Client[]>("api/teachers" + url)
        .get<client[]>("api/allclients")
        .then((x) => x.data)
    );
  }

  saveClient(Client: client) {
    const saveClient = axiosModule.instance
      .post<client>("api/client/add", Client)
      .then((x) => x.data);
    return saveClient;
  }

  updateClient(client: client) {
    const updateClient = axiosModule.instance
      .put<Client>("api/client/put", client)
      .then((x) => x.data);
    return updateClient;
  }

  deleteClient(id: number) {
    const deleteClient = axiosModule.instance
      .delete<any>("api/client/" + id)
      .then((x) => x.data);
    return deleteClient;
  }

  deletePayment(id: number) {
    const deletedClientPayment = axiosModule.instance
      .delete<any>("api/client_payment/" + id)
      .then((x) => x.data);
    return deletedClientPayment;
  }

  getClientPaymentsById(id: number, page: any) {
    return axiosModule.instance
      .get(
        "api/client_payments/getByClientId?client_id=" + id + "&page=" + page
      )
      .then((x) => x.data);
  }

  addPayment(payment: ClientPayment) {
    const savedPayment = axiosModule.instance
      .post<ClientPayment>(
        "api/client_payment/add?price=" +
          payment.price +
          "&client_id=" +
          payment.client_id +
          "&date=" +
          payment.date
      )
      .then((x) => x.data);

    return savedPayment;
  }

  getClientFactures(search: Search) {
    return axiosModule.instance
      .get("api/factures/getByClientId?" + search.toFilter())

      .then((x) => x.data);
  }

  deleteFacture(id: number) {
    const deleteFacture = axiosModule.instance
      .delete<any>("api/facture/" + id)
      .then((x) => x.data);
    return deleteFacture;
  }
}
