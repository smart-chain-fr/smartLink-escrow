<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-navigation-drawer v-model="drawer" floating app> </v-navigation-drawer>
    <v-app-bar
      app
      :style="{background: $vuetify.theme.themes.light.background}"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Admin pannel</v-app-bar-title>
      <v-spacer></v-spacer>
      <span class="running-contract"
        >Running contract:
        <code>{{ this.$store.state.user.contractAddress }}</code></span
      >
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-skeleton-loader
          v-if="loadTable"
          class="mx-auto"
          type="table"
        ></v-skeleton-loader>
        <div class="items" v-if="!loadTable">
            <h1 class="title">Transfers awaiting confirmation</h1>
             
            
            
            
          <table>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header" class="text-center">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody :key="render">
              <tr v-for="item in itemsWaitingForTransfer" :key="item.name">
                <td>
                  <v-row align="center">
                    <v-col cols="auto">
                      <img
                        :src="require(`../../assets/${item.picture}`)"
                        aspect-ratio="1"
                        width="55px"
                      />
                    </v-col>
                    <v-col cols="auto"
                      ><span class="name">{{ item.name }}</span
                      ><br /><span class="date"
                        >Last update on {{ item.update }}</span
                      ></v-col
                    ></v-row
                  >
                </td>
                <td class="text-center">{{ item.buyer }}</td>

                <td class="text-center">
                  {{ item.total }} <img
                      :src="require(`../../assets/tezos.png`)"
                      width="10px"
                    />
                  
                </td>
                <td class="text-center">
                  <v-btn
                  v-if="!item.confirmation"
                    depressed
                    color="main"
                    class="buy"
                    @click="validateSellerTransmission(item.id)"
                  >
                    Confirm transfer
                  </v-btn>
                   <div class="loading" v-if="item.confirmation">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular
                    ><span class="subtitle-1"> Sending transaction...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <v-skeleton-loader
          v-if="loadTable"
          class="mx-auto"
          type="table"
        ></v-skeleton-loader>
        <div class="items" v-if="!loadTable">
            <h1 class="title">Exchanges waiting for validation</h1>
                    
            
          <table>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header" class="text-center">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itemsWaitingForValidation" :key="item.name">
                <td>
                  <v-row align="center">
                    <v-col cols="auto">
                      <img
                        :src="require(`../../assets/${item.picture}`)"
                        aspect-ratio="1"
                        width="55px"
                      />
                    </v-col>
                    <v-col cols="auto"
                      ><span class="name">{{ item.name }}</span
                      ><br /><span class="date"
                        >Last update on {{ item.update }}</span
                      ></v-col
                    ></v-row
                  >
                </td>
                <td class="text-center">{{ item.buyer }}</td>

                <td class="text-center">
                  {{ item.total }} <img
                      :src="require(`../../assets/tezos.png`)"
                      width="10px"
                    />
                  
                </td>
                <td class="text-center">
                  <v-btn
                    v-if="!item.confirmation"
                    depressed
                    color="main"
                    class="buy"
                    @click="validateExchange(item.id)"
                  >
                    Validate exchange
                  </v-btn>
                  <div class="loading" v-if="item.confirmation">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular
                    ><span class="subtitle-1"> Sending transaction...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./Admin.ts"></script>
<style lang="scss" scoped src="./admin.scss"></style>
