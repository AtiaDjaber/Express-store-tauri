import HttpClient from "./httpClient";
import { Setting } from "@/classes/setting";
import axios from "axios";

export default class SettingApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public async getSetting(): Promise<any> {
    return await this.instance.get("api/settings");
  }

  async updateSetting(setting: any) {
    return await this.instance.put("api/setting/put", setting);
  }

  async uploadImage(formData: FormData) {
    return await axios.post(
      (process.env.VUE_APP_API_URL as string) + "api/setting/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  }
}
