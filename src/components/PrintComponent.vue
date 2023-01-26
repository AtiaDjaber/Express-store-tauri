<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mr-2"
        fab
        outlined
        small
        v-bind="attrs"
        v-on="on"
        color="primary"
      >
        <v-icon>mdi-printer-outline</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item class="px-2" @click="printSelectedFacture(item, false)" link>
        <v-list-item-avatar>
          <v-avatar size="36" color="primary lighten-4">
            <v-icon color="primary lighten-1">mdi-script</v-icon>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-title>طباعة وصل</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item class="px-2" @click="printSelectedFacture(item, true)" link>
        <v-list-item-avatar>
          <v-avatar size="36" color="primary lighten-4">
            <v-icon color="primary lighten-1">mdi-file</v-icon>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-title>طباعة فاتورة</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Setting } from "@/classes/setting";
import PrintImage from "@/print/print_image";
import settingModule from "@/store/settingModule";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class PrintComponent extends Vue {
  @Prop() item: unknown;
  @Prop({ default: "زبون" }) type: string;
  get setting(): Setting {
    return settingModule.getSetting;
  }

  printSelectedFacture(facture: any, isFacture = true): void {
    if (isFacture) {
      PrintImage.printFacturePdf(this.setting, facture, this.type);
    } else {
      PrintImage.printBon(this.setting, facture, this.type);
    }
  }
}
</script>
