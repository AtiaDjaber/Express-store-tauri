<template>
  <v-row>
    <v-col cols="4">
      <FournisseurView></FournisseurView>
    </v-col>
    <v-divider vertical class="my-6"></v-divider>
    <v-col>
      <fournisseur-detail></fournisseur-detail>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import FournisseurView from "@/views/fournisseur/FournisseurView.vue";
import { Component } from "vue-property-decorator";
import FournisseurDetail from "@/views/fournisseur/FournisseurDetail.vue";

@Component({
  components: { FournisseurDetail, FournisseurView },
})
export default class Fournisseurs extends Vue {}
</script>
