<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-navigation-drawer v-model="drawer" floating app> </v-navigation-drawer>
    <v-app-bar
      app
      :style="{background: $vuetify.theme.themes.light.background}"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Buy</v-app-bar-title>
      <v-spacer></v-spacer>
      <span class="running-contract"
        >Running contract:
        <code>{{ this.$store.state.user.contractAddress }}</code></span
      >
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <div class="items" v-if="isItemAvailable & loaded">
          <h1 class="title">Buying an item</h1>
          <section class="item">
            <v-chip class="chip" :color="`${data.type}`">
              {{ info[data.type].name }}
            </v-chip>
            <v-row align="center" class="banner">
              <v-col cols="auto">
                <img
                  :src="require(`../../assets/${data.picture}`)"
                  aspect-ratio="1"
                  width="55px"
                />
              </v-col>
              <v-col cols="auto"
                ><span class="name">{{ data.name }}</span
                ><br /><span class="date"
                  >Created on {{ data.date }}</span
                ></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <span class="seller">Sold by: {{ data.seller }}</span>
              </v-col>
            </v-row>
            <section class="description">
              {{ info[data.type].description }}
            </section>
            <v-row align="center" justify="space-between" class="prices">
              <v-col cols="auto" class="text-center">
                <h2 class="subtitle-1">Subtotal</h2>
                <span class="price">{{ data.price }}</span>
                <img :src="require(`../../assets/tezos.png`)" width="10px" />
              </v-col>
              <v-col cols="auto" class="text-center">
                <h2 class="subtitle-1">Shipping</h2>
                <span class="price">{{ data.shipping }}</span>
                <img :src="require(`../../assets/tezos.png`)" width="10px" />
              </v-col>
              <v-col cols="auto" class="text-center">
                <h2 class="subtitle-1">Fees</h2>
                <span class="price">{{ fees }}</span>
                <img :src="require(`../../assets/tezos.png`)" width="10px" />
              </v-col>
              <v-col cols="auto" class="text-center total">
                <h2 class="subtitle-1">Total</h2>
                <span class="price">{{ total }}</span>
                <img :src="require(`../../assets/tezos.png`)" width="10px" />
              </v-col>
            </v-row>
          </section>
          <section class="navigation-buttons">
            <v-row align="center" justify="space-between" class="prices">
              <v-col cols="auto">
                <v-btn depressed color="back" rounded :href="`/sales/`"> <v-icon left>mdi-chevron-left-circle</v-icon> Back </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn depressed color="forward" rounded @click="buy"> Pay <v-icon right>mdi-chevron-right-circle</v-icon></v-btn>
              </v-col>
            </v-row>
          </section>
        </div>
        <div v-if="!isItemAvailable & loaded">Error msg // put that later</div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./Buy.ts"></script>
<style lang="scss" scoped src="./buy.scss"></style>
