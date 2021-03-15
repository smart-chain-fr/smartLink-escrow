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
        <div class="items" v-if="isItemAvailable & loaded &!isPaymentInProcess">
          <h1 class="title">Buying an item</h1>
           <v-row justify="space-between">
              <v-col lg="8" md="12" cols="12" class="d-flex" style="flex-direction:column"> 
            <section class="item flex-grow-1">
               <v-row align="center">
               <v-col cols="auto"><v-chip class="chip" :color="`${data.type}`">
                {{ info[data.type].name }}
              </v-chip></v-col>
              <v-spacer></v-spacer>
                <v-col cols="auto" >
                  <span class="seller">Sold by: {{ data.seller }}</span>
                </v-col>
              </v-row>
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
                    >Created on {{ new Date(data.date).toLocaleString() }}</span
                  ></v-col>
              </v-row>
              <section class="description">
                {{ info[data.type].description }}
              </section>
            </section>
             </v-col>
          <v-col lg="4" md="12" cols="12" class="d-flex" style="flex-direction:column"> 
            <section class="prices flex-grow-1">
             
                <v-row justify="space-between">
                   <v-col cols="auto"><h2 class="subtitle-1">Subtotal</h2></v-col>
                   <v-col cols="auto"><span class="price">{{ data.price }}</span>
                  <img :src="require(`../../assets/tezos.png`)" width="10px" /></v-col>
              </v-row>
                
                   <v-row justify="space-between">
                   <v-col cols="auto"><h2 class="subtitle-1">Shipping</h2></v-col>
                   <v-col cols="auto"><span class="price">{{ data.shipping }}</span>
                  <img :src="require(`../../assets/tezos.png`)" width="10px" /></v-col>
              </v-row>
                
                
                   <v-row justify="space-between">
                   <v-col cols="auto"><h2 class="subtitle-1">Fees</h2></v-col>
                   <v-col cols="auto"><span class="price">{{ fees }}</span>
                  <img :src="require(`../../assets/tezos.png`)" width="10px" /></v-col>
              </v-row>
                
                
                   <v-row justify="space-between" class="total">
                   <v-col cols="auto"><h2 class="subtitle-1">Total</h2></v-col>
                   <v-col cols="auto"><span class="price">{{ total }}</span>
                  <img :src="require(`../../assets/tezos.png`)" width="10px" /></v-col>
              </v-row>
                
              
              
              </section>
          </v-col>
            </v-row>
          <section class="navigation-buttons">
            <v-row align="center" justify="space-between" >
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
        <div v-if="isPaymentInProcess">blblbl processing</div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./Buy.ts"></script>
<style lang="scss" scoped src="./buy.scss"></style>
