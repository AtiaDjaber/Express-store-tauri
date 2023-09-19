import { Setting } from "@/classes/setting";
import axios from "axios";
import axiosModule from "../store/axiosModule";

export default class SettingApi {
  public async getSetting(depot_id: string): Promise<any> {
    return await axiosModule.instance.get("api/settings?depot_id=" + depot_id);
  }

  async updateSetting(setting: any) {
    return await axiosModule.instance.put("api/setting/put", setting);
  }

  async uploadImage(formData: FormData) {
    const res = await axiosModule.instance.post(
      "api/setting/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return res;
  }
}
