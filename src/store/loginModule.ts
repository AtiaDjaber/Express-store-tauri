import {
  Action,
  Module,
  Mutation,
  RegisterOptions,
  VuexModule,
} from "vuex-class-modules";
import store from "@/store";
import LoginService from "@/service/loginService";
import User from "@/classes/user";

@Module
export class LoginModule extends VuexModule {
  _service: LoginService;
  isLoggedIn = false;
  _user: string | null;

  constructor(service: LoginService, options: RegisterOptions) {
    super(options);
    this._service = service;
    this._user = localStorage.getItem("user");
    this.isLoggedIn = this._user !== null;
  }

  @Action
  login(user: User): Promise<User | null> {
    return this._service.login(user).then((x) => {
      if (x) {
        
        x.chart = x.chart + "" === "1";
        x.facture = x.facture + "" === "1";
        x.client = x.client + "" === "1";
        x.expense = x.expense + "" === "1";
        x.user = x.user + "" === "1";
        x.password = undefined;
        
        this.setUser(JSON.stringify(x));

        return x;
      }
      return null;
    });
  }

  @Mutation
  setUser(x: string) {
    this._user = x;
    if (x != "") {
      localStorage.setItem("user", x);
      this.isLoggedIn = true;
    } else {
      localStorage.removeItem("user");
      this.isLoggedIn = false;
    }
  }

  @Action
  logout() {
    this.setUser("");
  }

  get isLogin() {
    return this.isLoggedIn;
  }
  get getCurrentUser() {
    return JSON.parse(this._user!);
  }
}
export default new LoginModule(new LoginService(), {
  store,
  name: "login",
});
