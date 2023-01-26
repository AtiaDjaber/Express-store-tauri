<template>
  <v-dialog v-model="dialog" persistent max-width="450">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn fab small outlined color="red">
          <v-icon>fa-trash</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="text-h5"> حذف </v-card-title>
      <v-card-text>
        <h3>هل أنت متأكد؟</h3>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text color="green darken-1" @click="close"> إلفاء </v-btn>
        <v-btn text color="red darken-1" @click="manage">حذف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
// import userApi from "@/api/userApi";
@Component({})
export default class userDelete extends Vue {
  @Prop() id!: number;
  @Prop() source!: string;
  @Prop() disabled!: boolean;
  public dialog = false;
  close() {
    this.dialog = false;
  }

  // private api = new userApi();

  manage() {
  //   if (this.source == "Users")
  //     this.api
  //       .deleteUser(this.id)
  //       .then((result) => {
  //         this.$root.$emit("deleteduserid", this.id);
  //         SnackBarModule.setSnackbar({
  //           text: "تم الحذف",
  //           color: "success",
  //           timeout: 2000,
  //           show: true,
  //           icon: "check",
  //           x: "right",
  //           y: "top",
  //         });
  //       })
  //       .catch((error) => {
  //         SnackBarModule.setSnackbar({
  //           text: error,
  //           color: "error",
  //           timeout: 2000,
  //           show: true,
  //           icon: "mdi-alert-outline",
  //           x: "right",
  //           y: "top",
  //         });
  //       });
  //   this.close();
  }
}
</script>
