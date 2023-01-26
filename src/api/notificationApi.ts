import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";

export default class notificationApi {
  static async getNotificationsApi(search?: Search): Promise<any> {
    return await axiosModule.instance.get("api/notifications");
  }
}
