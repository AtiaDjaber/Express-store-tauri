import { Notification } from "@/classes/notification";
import { VuexModule, Module, Mutation } from "vuex-class-modules";
import store from "./index";
import SoundService from "@/service/soundService";

@Module({ generateMutationSetters: true })
class SnackBarModule extends VuexModule {
  // state
  notifications: Notification[] = [];

  // getters
  get getNotifications() {
    return this.notifications;
  }

  @Mutation
  setSnackbar(playload: Notification) {
    this.notifications = [];
    playload.text= !(playload.text + "").includes("500") ? playload.text : "فشلت العملية",
    this.notifications.push(playload);
  }
}

export default new SnackBarModule({ store, name: "snackBarModule" });
