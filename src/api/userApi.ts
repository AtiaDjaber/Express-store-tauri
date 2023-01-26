import User from "@/classes/user";
import axiosModule from "@/store/axiosModule";
import HttpClient from "./httpClient";

export default class userApi {
  public async getUser(pageNumber?: string): Promise<any> {
    return await axiosModule.instance.get("api/users?page=" + pageNumber);
  }

  async saveUser(user: User): Promise<any> {
    return await axiosModule.instance.post("api/register", user);
  }

  deleteUser(id: number) {
    const deletedUser = axiosModule.instance
      .delete<any>("api/user/delete/" + id)
      .then((x) => x.data);
    return deletedUser;
  }

  async updateUser(user: User) {
    return axiosModule.instance.put<User>("api/user/put", user);
  }

  async updatePasswordUser(user: User) {
    return axiosModule.instance.put<User>("api/user/reset", user);
  }

  public async getAllUser(): Promise<any> {
    return await axiosModule.instance.get("api/all_users");
  }
}
