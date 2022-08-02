import User from "@/classes/user";
import axios from "axios";
import snackBarModule from "@/store/snackBarModule";
export default class LoginService {

  public login(user: User): Promise<User> {
    return axios
      .post(process.env.VUE_APP_API_URL + `api/login`, user)
      .then((x) => {
        if (x.status == 200) {
          
          axios.defaults.headers.common['Authorization'] = x.data['token'];
          localStorage.setItem("token",x.data['token']);

          return x.data['data'];
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
