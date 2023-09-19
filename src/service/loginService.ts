import User from "@/classes/user";
import snackBarModule from "@/store/snackBarModule";
import axiosModule from "@/store/axiosModule";
import axios from "axios";
export default class LoginService {
  public login(user: User): Promise<User> {
    return axiosModule.instance.post(`api/login`, user).then((x) => {
      if (x.status == 200) {
        // axios.defaults.headers.common["Authorization"] = x.data["token"];
        // axiosModule.instance.defaults.headers.common["Authorization"] =
        //   "Bearer " + x.data["token"];
        localStorage.setItem("token", x.data["token"]);

        return x.data["data"];
      } else {
        snackBarModule.setSnackbar({
          text: "معلومات الدخول خاطئة",
          color: "error",
          timeout: 2000,
          show: true,
          icon: "mdi-alert-outline",
          x: "right",
          y: "top",
        });
        return null;
      }
    });
  }
}
