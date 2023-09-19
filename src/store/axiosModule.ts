import store from ".";

import axios, { AxiosInstance } from "axios";
// import client from "@/classes/client";

export default class axiosModule {
  public static instance: AxiosInstance;

  // create single instance from axios
  constructor(baseURL: string) {
    axiosModule.instance = axios.create({
      baseURL,
      headers: {
        "Content-type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log(baseURL);
    console.log(axiosModule.instance.defaults.baseURL);
  }

  // add token to axios instance
  static setAxiosToken() {
    this.instance.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("token");
  }

  // get instance axios
  get axios(): AxiosInstance {
    return this.axios;
  }
}
