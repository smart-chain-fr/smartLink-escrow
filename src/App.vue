<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/beacon_logo.svg" />
    <Escrow />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Beacon from "./components/Beacon.vue";
import Escrow from "./components/Escrow.vue";

@Component({
  components: {
    Beacon,
    Escrow,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
