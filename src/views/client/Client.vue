<template>
  <v-row>
    <v-col cols="5">
      <ClientView></ClientView>
    </v-col>
    <v-divider vertical class="my-6"></v-divider>
    <v-col>
      <ClientDetail></ClientDetail>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import ClientView from "@/views/client/ClientView.vue";
import { Component } from "vue-property-decorator";
import ClientDetail from "@/views/client/ClientDetail.vue";

@Component({
  components: { ClientDetail, ClientView },
})
export default class Clients extends Vue {}
</script>
