<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableTeacherAction == 2 && !Client.id"
          :fab="isFab"
          :class="isFab ? 'mt-1 mx-1' : 'mx-1'"
          :color="!isFab ? 'primary' : ''"
          :large="!isFab"
          :small="isFab"
          :elevation="!isFab ? 1 : 0"
        >
          {{ !isFab ? $t("add_client") : "" }}
          <v-icon class="ms-2">mdi-account-plus-outline</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text">
        <span style="font-size: 20px" class="mr-5 mb-1 font-weight-bold">
          {{
            mutableTeacherAction == 1
              ? $t("add_client")
              : "تعديل معلومات الزبون"
          }}
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-2">
              <v-col class=""
                ><v-text-field
                  :hint="$t('full_name')"
                  :placeholder="$t('full_name')"
                  flat
                  solo
                  v-model="Client.name"
                  :rules="vTeacher.firstname"
                ></v-text-field
              ></v-col>
              <v-col class=""
                ><v-text-field
                  :hint="$t('montant')"
                  :placeholder="$t('montant')"
                  flat
                  solo
                  type="number"
                  v-model="Client.montant"
                ></v-text-field
              ></v-col>
            </v-row>

            <v-row class="mt-n6">
              <v-col
                ><v-text-field
                  :hint="$t('phone')"
                  :placeholder="$t('phone')"
                  flat
                  solo
                  hide-spin-buttons
                  type="number"
                  v-model="Client.mobile"
                  :rules="vTeacher.mobile"
                ></v-text-field
              ></v-col>
              <v-col class="">
                <v-text-field
                  :hint="$t('email')"
                  :placeholder="$t('email')"
                  flat
                  solo
                  v-model="Client.email"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="">
                <v-text-field
                  :hint="$t('address')"
                  :placeholder="$t('address')"
                  flat
                  solo
                  v-model="Client.address"
                ></v-text-field
              ></v-col>
              <v-col cols="">
                <v-text-field
                  :hint="$t('NIF')"
                  :placeholder="$t('NIF')"
                  flat
                  solo
                  v-model="Client.nif"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="">
                <v-text-field
                  :hint="$t('NºRC')"
                  :placeholder="$t('NºRC')"
                  flat
                  solo
                  v-model="Client.n_rc"
                ></v-text-field
              ></v-col>
              <v-col cols="">
                <v-text-field
                  :hint="$t('NºAI')"
                  :placeholder="$t('NºAI')"
                  flat
                  solo
                  v-model="Client.n_ai"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col>
                <v-row no-gutters>
                  <v-btn
                    @click="generateBarcode()"
                    class="me-2"
                    flat
                    fab
                    rounded
                    height="45"
                    width="45"
                    tile
                    elevation="0"
                    color="#E7FBE7"
                  >
                    <v-icon color="green">mdi-barcode</v-icon>
                  </v-btn>
                  <v-col>
                    <v-text-field
                      :hint="$t('barcode')"
                      :placeholder="$t('barcode')"
                      flat
                      solo
                      v-model="Client.barcode"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-text-field
                  :hint="$t('points')"
                  :placeholder="$t('points')"
                  flat
                  solo
                  v-model="Client.point"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row class="mt-n6">
              <h3 class="pt-2 px-4">{{ $t("card_status") }}</h3>
              <v-col>
                <v-btn-toggle
                  v-model="Client.is_faithful"
                  mandatory
                  group
                  class="mt-n6"
                  background-color="red"
                  color="primary"
                >
                  <v-btn text> {{ $t("inactive") }} </v-btn>
                  <v-btn text> {{ $t("active") }} </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row v-if="Client.name" justify="end">
              <v-btn
                large
                color="primary"
                outlined
                text
                class="my-2"
                width="292"
                @click="createPdf()"
              >
                <v-icon color="primary" class="mx-2"> fa-print </v-icon>
                {{ $t("print") }}
              </v-btn>
            </v-row>
            <v-row justify="end" v-if="Client.name">
              <v-card
                outlined
                :color="$vuetify.theme.dark ? 'white' : undefined"
                class="pa-3"
              >
                <div id="barcodePrint">
                  <v-row justify="center" class="mb-0 mt-2">
                    <h3 style="letter-spacing: normal; color: black">
                      {{
                        Client.name != undefined
                          ? Client.name.substring(0, 30)
                          : ""
                      }}
                    </h3>
                  </v-row>

                  <barcode
                    displayValue="false"
                    format="CODE128"
                    :value="Client.barcode"
                    font-options="bold"
                    width="2"
                    height="80"
                    margin-bottom="1"
                    margin-top="1"
                  >
                  </barcode>
                  <v-row justify="center" class="my-0">
                    <h4 style="letter-spacing: normal; color: black">
                      {{ setting.name_store }}
                    </h4>
                  </v-row>
                </div>
              </v-card>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          outlined
          large
          class="mx-6"
          color="red darken-1"
          @click="close"
          >{{ $t("cancel") }}</v-btn
        >
        <v-btn
          large
          class="mx-3"
          color="primary "
          v-if="mutableTeacherAction === 1"
          @click="manage"
          >{{ $t("save") }}</v-btn
        >
        <v-btn large color="primary" v-else @click="manage">{{
          $t("edit")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import client from "@/classes/client";
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import VTeacher from "@/validation/vTeacher";
import Search from "@/classes/search";
import CDatePicker from "@/components/CDatePicker.vue";
import settingModule from "@/store/settingModule";
import { Setting } from "@/classes/setting";
import VueBarcode from "vue-barcode";
import PrintImage from "@/print/print_image";
import stockApi from "@/api/stockApi";

@Component({ components: { CDatePicker, barcode: VueBarcode } })
export default class ManageTeacher extends Vue {
  @Prop({ default: 0 }) teacherAction!: number;
  @Prop({ default: false }) isFab!: boolean;
  mutableTeacherAction = 0;
  tab = 0;
  @Ref() form: any;

  img = undefined;
  previewImage = "";
  selectImage(image: any) {
    this.img = image;
    this.previewImage = URL.createObjectURL(this.img);
  }

  public dialog = false;
  valid = true;
  Client = {
    montant: 0.0,
    ancien: 0.0,
    point: 0,
    barcode: "",
    is_faithful: false,
  } as client;
  vTeacher = new VTeacher();

  search = { name: "", url: "" } as Search;

  created() {
    this.mutableTeacherAction = this.teacherAction;

    this.$root.$on("editClient", (Client: client) => {
      this.Client = Object.assign({}, Client);
      console.log(this.Client);
      this.mutableTeacherAction = 2;
      this.dialog = true;
    });
  }

  generateBarcode(): void {
    stockApi.getBarcode("clients").then((res) => {
      this.Client.barcode = res.data;
    });
  }
  close() {
    this.Client = {
      montant: 0.0,
      ancien: 0.0,
      barcode: "",
      point: 0,
    } as client;
    this.mutableTeacherAction = 1;
    this.dialog = false;
  }

  createPdf(): void {
    PrintImage.printBarcode(
      document.getElementById("barcodePrint"),
      this.setting,1
    );
  }

  get setting(): Setting {
    return settingModule.getSetting;
  }
  // TODO teacher_id: savedClient.id ?? 0,            ضفتلها ؟؟ 0
  manage() {
    if (this.form.validate()) {
      if (this.mutableTeacherAction == 1) {
        clientModule
          .saveclient(this.Client)
          .then((result) => {
            let savedClient = (result as any).data as client;
            this.$root.$emit("createdClient", savedClient);

            SnackBarModule.setSnackbar({
              text: "تمت الإضافة بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });
      } else {
        clientModule
          .updateClient(this.Client)
          .then((result) => {
            let updatedclient = (result as any).data as client;
            this.$root.$emit("updatedClient", updatedclient);
            SnackBarModule.setSnackbar({
              text: "تم التعديل بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });
      }
      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      this.close();
    }
  }
}
</script>
