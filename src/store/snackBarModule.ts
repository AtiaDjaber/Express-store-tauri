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

  validationErrors(messages: any): string[] {
    return Object.values<string>(messages).flat();
  }
  @Mutation
  setSnackbar(playload: Notification) {
    this.notifications = [];

    if (playload.text.toString().includes("500")) {
      playload.text = "فشلت العملية";
      playload.icon = "mdi-alert-outline";
    } else if (playload.text.toString().includes("422")) {
      playload.text = this.validationErrors(
        (playload.text as any).response.data["message"]
      ).join("\n,");
      playload.color = "blue";
    } else if (playload.text.toString().includes("401")) {
      playload.text = "معلومات الدخول غير صحيحة";
      playload.icon = "mdi-alert-outline";
    }
    this.notifications.push(playload);
  }
}

export default new SnackBarModule({ store, name: "snackBarModule" });
