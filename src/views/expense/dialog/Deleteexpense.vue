<template>
  <v-dialog v-model="dialog" persistent max-width="350">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn rounded small outlined color="pink">
          <v-icon class="pink--text">mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-divider color="#F5005 "></v-divider>
      <v-divider color="#F5005"></v-divider>
      <v-divider color="#F5005"></v-divider>
      <v-divider color="#F5005"></v-divider>

      <v-card-title class="text-h5"> هل أنت متأكد؟</v-card-title>

      <v-card-actions class="justify-end">
        <v-btn outlined color="grey darken-1" @click="close"> إلفاء</v-btn>
        <v-btn color="pink accent-3" @click="manage" style="color: white">حذف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
// import studentModule from "@/store/studentModule";
import SnackBarModule from "@/store/snackBarModule";
import expenseApi from "@/api/expenseApi";
@Component({})
export default class Deleteexpense extends Vue {
  @Prop() id!: number;
  @Prop() source!: string;
  @Prop() disabled!: boolean;
  public dialog = false;

  close() {
    this.dialog = false;
  }

  private api = new expenseApi();

  manage() {
    // if (this.source == "Expenses")
    //  this.$root.$emit("deletedexpenseid", this.id);
    //   this.api
    //     .deleteExpense(this.id)
    //     .then((result) => {
    //       this.$root.$emit("deletedexpenseid", this.id);
    //       SnackBarModule.setSnackbar({
    //         text: "تم الحذف",
    //         color: "success",
    //         timeout: 2000,
    //         show: true,
    //         icon: "check",
    //         x: "right",
    //         y: "top",
    //       });
    //     })
    //     .catch((error) => {
    //       SnackBarModule.setSnackbar({
    //         text: error,
    //         color: "error",
    //         timeout: 2000,
    //         show: true,
    //         icon: "mdi-alert-outline",
    //         x: "right",
    //         y: "top",
    //       });
    //     });
    // this.close();
  }
}
</script>
