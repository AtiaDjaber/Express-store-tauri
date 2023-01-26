import { Action, Module, Mutation, VuexModule } from "vuex-class-modules";
import store from ".";
import { Setting } from "@/classes/setting";
import SettingApi from "@/api/setting_api";

@Module({ generateMutationSetters: true })
class settingModule extends VuexModule {
  settingApi = new SettingApi();
  setting = this.initializeSetting();

  get getSetting() {
    return this.setting;
  }

  initializeSetting(): Setting {
    return {
      depot_id: null,
      address: "",
      email: "",
      remark: "",
      tel: "",
      warning: "",
      name_store: "اسم المحل",
    } as Setting;
  }
  @Action
  async getSettings() {
    this.setting =
      JSON.parse(localStorage.getItem("setting")) ?? this.initializeSetting();
    return this.setting;
  }

  @Mutation
  setSetting(setting: Setting) {
    this.setting = setting;
    localStorage.setItem("setting", JSON.stringify(setting));
  }
}

export default new settingModule({
  store: store,
  name: "settingModule",
});
