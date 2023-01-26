<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <Usermanege :userAction="1" />
      <PasswordReset></PasswordReset>

      <v-spacer></v-spacer>
    </v-row>
    <v-col>
      <v-card outlined>
        <v-data-table
          :headers="Headers"
          :items="listuser"
          single-select
          @click:row="rowClick"
          :server-items-length="count"
          :items-per-page="10"
          @update:options="paginate"
          :footer-props="{
            'items-per-page-options': [10, 10],
            'show-current-page': true,
            'show-first-last-page': true,
            'page-text': 'رقم الصفحة',
            'items-per-page-text': 'عدد الأسطر',
          }"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-row>
              <v-btn
                color="green"
                class="ml-2"
                small
                outlined
                fab
                elevation="0"
                @click="edituser(item)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>

              <DeleteDialog
                :id="item.id"
                :disabled="false"
                :source="'UserView.vue'"
              />

              <v-btn
                color="primary"
                class="mr-2"
                small
                outlined
                fab
                elevation="0"
                @click="resetUser(item)"
              >
                <v-icon>mdi-lock-outline</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-table></v-card
      >
    </v-col>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Usermanege from "@/views/user/dialog/usermanege.vue";
import userApi from "@/api/userApi";
import User from "@/classes/user";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import printe from "@/views/printe/PrinteViews.vue";
import PasswordReset from "@/views/user/dialog/PasswordReset.vue";
@Component({ components: { Usermanege, DeleteDialog, printe, PasswordReset } })
export default class Users extends Vue {
  Headers = [
    { text: "الاسم", value: "name" },
    { text: "البريد الإلكتروني", value: "email" },
    { text: "الهاتف", value: "tel" },
    // { text: "الحالة", value: "status" },
    { text: "التاريخ", value: "created_at" },
    // { text: "كلمة المرور", value: "password" },
    { text: "", value: "actions" },
  ];

  count = 0;
  original = "";
  private api = new userApi();
  listuser = [] as User[];
  selectuser = {} as User;
  @Prop() data!: User[];

  getUsers(pageNumber: string): void {
    this.api
      .getUser(pageNumber)
      .then((response) => {
        // console.log(response);

        this.listuser = [];
        this.listuser.length = 0;
        if (response.status == 200) {
          (response.data.data as User[]).forEach((x) => {
            x.chart = x.chart + "" === "1";

            x.user = x.user + "" === "1";
            this.listuser.push(x);
          });
          this.count = response.data.total;
        }
      })
      .catch((error) => {
        //   SnackBarModule.setSnackbar({
        //     text: error,
        //     color: "error",
        //     timeout: 2000,
        //     show: true,
        //     icon: "mdi-alert-outline",
        //     x: "right",
        //     y: "top",
        //   });
      });
  }

  // counter1: number = 7;
  // counter2: number = 1;
  // counter: number = 1;

  created() {
    // for (let i = 1; i <= 6; i++) {
    // this.counter1 = this.counter1 - 1;
    // this.counter2 = this.counter2 * this.counter1;
    // console.log(this.counter2);
    // }

    // this.getUsers("1");

    this.$root.$on("createdUser", (user: User) => {
      this.listuser.unshift(user);
      this.count++;
    });

    this.$root.$on("deletedUserId", (Deleteduserid: number) => {
      if (Deleteduserid) {
        this.listuser.splice(
          this.listuser.indexOf(
            this.listuser.find((c) => c.id == Deleteduserid) ?? ({} as User)
          ),
          1
        );
      }
    });

    this.$root.$on("updatedUser", (updateUser: User) => {
      if (updateUser) {
        this.listuser?.splice(
          this.listuser?.indexOf(
            this.listuser?.find((s) => s.id == updateUser.id) ?? ({} as User)
          ),

          1,
          updateUser
        );
      }
    });
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectuser = item;
      // item.name='ffff' ;
    } else {
      row.select(false);
      this.selectuser = {} as User;
    }
  }

  edituser(edited: any) {
    this.$root.$emit("edituser", edited);
  }

  resetUser(edited: any) {
    this.$root.$emit("reset_password", edited);
  }

  paginate(obj: any) {
    this.getUsers(obj.page);
  }
}
</script>
