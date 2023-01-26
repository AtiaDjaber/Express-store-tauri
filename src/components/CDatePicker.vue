<template>
  <v-menu
    ref="menuRef"
    v-model="menuState"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        ref="input"
        v-model="date"
        :label="label"
        :outlined="outlined"
        solo
        flat
        append-icon="mdi-calendar"
        :background-color="color"
        :dense="dense"
        v-bind="attrs"
        v-on="on"
        :rules="rules"
        :readonly="readonly"
        :placeholder="placeholder"
        :hint="placeholder"
        :clearable="clearable"
        @click:clear="trigger"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      ref="datePickerRef"
      @change="saveDate"
      picker-date=""
      scrollable
      locale="AR-dz"
    >
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import {
  Component,
  Model,
  Prop,
  Ref,
  Vue,
  Watch,
} from "vue-property-decorator";
@Component({})
export default class CDatePicker extends Vue {
  @Model("changeValue") readonly value!: unknown;
  @Ref() input!: unknown;
  @Prop() rules!: unknown[];
  @Prop({ default: "" }) color!: string;
  @Prop({ default: "" }) label!: string;
  @Prop({ default: "" }) placeholder!: string;
  @Prop({ default: false }) dense!: boolean;
  @Prop({ default: false }) clearable!: boolean;
  @Prop({ default: false }) outlined!: boolean;
  @Prop({ default: true }) readonly!: boolean;
  // @Prop({ default: "" }) min: string;
  // @Prop({ default: "" }) max: string;
  // TODO :min="min" :max="max"
  date = "";
  @Ref() menuRef!: any;
  @Ref() datePickerRef!: any;
  menuState = false;
  saveDate(date: string): void {
    this.menuRef.save(date);
    this.$emit("changeValue", date);
  }

  @Watch("value", { immediate: true, deep: true })
  changeValue() {
    this.value ? (this.date = this.value as string) : (this.date = "");
  }

  trigger() {
    this.$emit("eventname", null);
  }
}
</script>

<style scoped>
::v-deep div.v-date-picker-table {
  height: auto;
  padding: 10px;
}
</style>
