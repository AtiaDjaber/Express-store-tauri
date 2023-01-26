import User from "@/classes/user";
import HttpClient from "./httpClient";
import clientModule from "@/store/clientModule";
import axiosModule from "@/store/axiosModule";

export default class reparationApi  {
  

  public async getRep(id?: number, page?: string): Promise<any> {
    console.log("the id is = " + id);
    // console.log("moduleid = " + clientModule.client.id);

    return await axiosModule.instance.get(
      "api/reparations?client_id=" + id + "&page=" + page
    );
  }

  //   public async getRep(): Promise<any> {
  //     // console.log("the id is = " + id)
  //   return await axiosModule.instance.get("api/reparations");
  // }
}
