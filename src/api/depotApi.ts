import depot from "@/classes/depot";
import Depot from "@/classes/depot";
import HttpClient from "./httpClient";
import Search from "@/classes/search";
import expense from "@/classes/expense";

export default class DepotApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL);
  }
  public getDepots(search?: Search): Promise<expense[]> {
    return this.instance.get<expense[]>("api/depots?" + search.toFilter())
        .then((x) => x.data);
  }

  public getAllDepots(url?: string): Promise<Depot[]> {
    return (
      this.instance.get("api/depots")
        .then((x) => x.data)
    );
  }

  saveDepot(depot: Depot): Promise<unknown> {
    const saveDepot = this.instance
      .post("api/depot/add", depot)
      .then((x) => x.data);
    return saveDepot;
  }

  updateDepot(depot: Depot) {
    const updateDepot = this.instance
      .put<Depot>("api/depot/put", depot)
      .then((x) => x.data);
    return updateDepot;
  }

  deleteDepot(id: number) {
    const deleteDepot = this.instance
      .delete("api/depot/" + id)
      .then((x) => x.data);
    return deleteDepot;
  }
}
