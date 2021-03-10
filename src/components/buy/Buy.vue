<template>
 <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-navigation-drawer v-model="drawer" floating app>
    </v-navigation-drawer>
    <v-app-bar app :style="{background: $vuetify.theme.themes.light.background}">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Buy</v-app-bar-title>
      <v-spacer></v-spacer>
      <span class="running-contract">Running contract: <code>{{ contract }}</code></span>
    </v-app-bar>
    <v-main >
      <v-container fluid>
    
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./Buy.ts"></script>
<style lang="scss" scoped src="./buy.scss"></style>