<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-navigation-drawer v-model="drawer" floating app> </v-navigation-drawer>
    <v-app-bar
      app
      :style="{background: $vuetify.theme.themes.light.background}"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Sales</v-app-bar-title>
      <v-spacer></v-spacer>
      <span class="running-contract"
        >Running contract:
        <code>{{ this.$store.state.user.contractAddress }}</code></span
      >
    </v-app-bar>
    <v-main>
      <v-container fluid>
       blblb

      {{ filteredData("transfer") }}
       
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./Track.ts"></script>
<style lang="scss" scoped src="./track.scss"></style>
