<template>
  <v-navigation-drawer v-model="drawer" floating app>
    <v-list-item>
      <v-list-item-content>
        <v-img :src="require('../../assets/full_logo.svg')"> </v-img>
        <v-list-item-subtitle>
          Buy, Sell, Swap goods on your terms
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="item in navigation"
        :key="item.title"
        link
        :to="{ name: item.name }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-if="item.name === 'offers'">
            {{ item.title }}
            <v-chip label small> {{ nbNew}} </v-chip></v-list-item-title
          >
          <v-list-item-title v-else>
            {{ item.title }}
            </v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="text-center">
        <!-- Powered by SmartLink -->
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script lang="ts" src="./Navigation.ts"></script>
<style lang="scss" scoped src="./navigation.scss"></style>
