<template>
  <div class="mx-2">
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn large class="mx-5 px-2" icon v-bind="attrs" v-on="on">
          <v-icon class="px-3">mdi-chevron-down</v-icon>{{ locale }}
        </v-btn>
      </template>

      <v-list class="px-3">
        <v-list-item
          @click="
            () => {
              changeLocale('ar');
            }
          "
        >
          <v-list-item-title>العربية </v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="
            () => {
              changeLocale('fr');
            }
          "
        >
          <v-list-item-title>Français</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="
            () => {
              changeLocale('en');
            }
          "
        >
          <v-list-item-title>English</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import settingModule from "@/store/settingModule";
import { Component, Vue } from "vue-property-decorator";
@Component({ components: {} })
export default class LocaleComponent extends Vue {
  changeLocale(locale: string): void {
    this.$i18n.locale = locale;
    this.$vuetify.rtl = locale == "ar" ? true : false;
    settingModule.setting.locale = locale;
    settingModule.setSetting(settingModule.setting);
  }
  get locale(): string {
    return this.$i18n.locale == "ar"
      ? "العربية"
      : this.$i18n.locale == "fr"
      ? "Français"
      : "English";
  }
  created(): void {
    this.changeLocale(settingModule.setting.locale);
  }
}
</script>
