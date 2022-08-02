import axios, { AxiosInstance } from "axios";

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
  }
}
