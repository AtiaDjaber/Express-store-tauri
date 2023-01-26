<template>
  <v-row>
    <v-col cols="5">
      <BoxView></BoxView>
    </v-col>
    <v-divider vertical class="my-6"></v-divider>
    <v-col>
      <box-tabs></box-tabs>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import BoxView from "@/views/box/BoxView.vue";
import { Component } from "vue-property-decorator";
import BoxTabs from "@/views/box/BoxTabs.vue";

@Component({
  components: { BoxTabs, BoxView },
})
export default class Box extends Vue {}
</script>
