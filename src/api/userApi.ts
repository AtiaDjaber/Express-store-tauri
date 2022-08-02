import User from "@/classes/user";
import HttpClient from "./httpClient";

export default class userApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL as string);
  }

  public async getUser(pageNumber?: string): Promise<any> {
    return await this.instance.get("api/users?page=" + pageNumber);
  }

  async saveUser(user: User): Promise<any> {
    return await this.instance.post("api/register", user);
  }

  deleteUser(id: number) {
    const deletedUser = this.instance
      .delete<any>("api/user/delete/" + id)
      .then((x) => x.data);
    return deletedUser;
  }

  async updateUser(user: User) {
    return this.instance.put<User>("api/user/put", user);
  }
}
