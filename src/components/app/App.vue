<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-main>
      
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss" scoped src="./app.scss"></style>