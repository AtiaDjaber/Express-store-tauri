import depot from "@/classes/depot";
import Depot from "@/classes/depot";
import HttpClient from "./httpClient";
import Search from "@/classes/search";
import expense from "@/classes/expense";
import axiosModule from "@/store/axiosModule";

export default class DepotApi {
  public getDepots(search?: Search): Promise<expense[]> {
    return axiosModule.instance
      .get<expense[]>("api/depots?" + search.toFilter())
      .then((x) => x.data);
  }

  public getAllDepots(url?: string): Promise<Depot[]> {
    return axiosModule.instance.get("api/depots").then((x) => x.data);
  }

  saveDepot(depot: Depot): Promise<unknown> {
    const saveDepot = axiosModule.instance
      .post("api/depot/add", depot)
      .then((x) => x.data);
    return saveDepot;
  }

  updateDepot(depot: Depot) {
    const updateDepot = axiosModule.instance
      .put<Depot>("api/depot/put", depot)
      .then((x) => x.data);
    return updateDepot;
  }

 static deleteDepot(id: number) {
    const deleteDepot = axiosModule.instance
      .delete("api/depot/" + id)
      .then((x) => x.data);
    return deleteDepot;
  }
}
