import User from "@/classes/user";
import HttpClient from "./httpClient";
import clientModule from "@/store/clientModule";

export default class reparationApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public async getRep(id?: number, page?: string): Promise<any> {
    console.log("the id is = " + id);
    // console.log("moduleid = " + clientModule.client.id);

    return await this.instance.get(
      "api/reparations?client_id=" + id + "&page=" + page
    );
  }

  //   public async getRep(): Promise<any> {
  //     // console.log("the id is = " + id)
  //   return await this.instance.get("api/reparations");
  // }
}
