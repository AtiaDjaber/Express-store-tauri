import {Action, Module, Mutation, VuexModule} from "vuex-class-modules";
import store from ".";
import {Setting} from "@/classes/setting";
import SettingApi from "@/api/setting_api";

@Module({generateMutationSetters: true})
class settingModule extends VuexModule {
    settingApi = new SettingApi();
    setting = {} as Setting;

    get getSetting() {
        return this.setting;
    }

    @Action
    async getSettings() {
        const res = await this.settingApi.getSetting();
        this.setting = res.data;

        return this.setting;
    }

    @Mutation
    setSetting(setting: Setting) {
        this.setting = setting;
    }

}

export default new settingModule({
    store: store,
    name: "settingModule",
});
