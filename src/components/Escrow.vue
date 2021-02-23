<template>
  <div class="hello">
    <h3>Update exchange types</h3>
    <br />
    <input 
      placeholder="Enter a type to update"
      v-model="exchangeType.type"
    >
    <input 
      v-model="exchangeType.commission"
    >
    <button v-on:click="updateExchangeTypes">Update exchange type</button>
    <br />

    <h3>Buy someting</h3>
    <br />
    <div v-for="item in goodsToBuy" :key ="item.domain_name" class="menu-item">
        <div v-if="!item.bought">
            <h4>{{ item.domainName }}</h4>
            <p>{{ item.price }}</p>
            <button v-on:click="buy(item)">Update exchange type</button>
        </div>
    </div>

     <a href="/escrow" class="nav-link">Add</a>
    
    <br />


    {{ taquitoOperationHash }}

    <h3>Links</h3>
    <ul>
      <li>
        <a
          href="https://github.com/airgap-it/beacon-vue-example"
          target="_blank"
          rel="noopener"
          >Github</a
        >
      </li>
      <li>
        <a
          href="https://github.com/airgap-it/beacon-sdk"
          target="_blank"
          rel="noopener"
          >Beacon SDK</a
        >
      </li>
      
      <li>
        <a href="https://www.walletbeacon.io/" target="_blank" rel="noopener"
          >walletbeacon.io</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  DAppClient,
  BeaconEvent,
  NetworkType,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Component, Vue } from "vue-property-decorator";

const Tezos = new TezosToolkit('https://delphinet.smartpy.io')

@Component
export default class Escrow extends Vue {
  // Taquito Example
  public taquitoOperationHash: string | null = null;

  public receiverAddress: string | null = "";
  
  public exchangeType: any = { type: "", commission: 0 };

  public goodsToBuy: any = [
      {
          seller : "tz1VLCwEegxpLH9gepjWbyqwn9w1qbcmRN3U",
          price : "10",
          type: "DOMAIN_NAME",
          domainName: "blblblb",
          bought : false
      },
      {
          seller : "tz1VLCwEegxpLH9gepjWbyqwn9w1qbcmRN3U",
          price : "150",
          type: "DOMAIN_NAME",
          domainName: "blblblb2",
          bought : false
      },
      {
          seller : "tz1VLCwEegxpLH9gepjWbyqwn9w1qbcmRN3U",
          price : "30",
          type: "DOMAIN_NAME",
          domainName: "blblblb3",
          bought : false
      },
  ]
  
    private wallet = new BeaconWallet({
    name: "Escrow DApp",
    eventHandlers: {
      // Overwrite standard behavior of certain events
      [BeaconEvent.PAIR_INIT]: {
        handler: async (syncInfo) => {
          // Add standard behavior back (optional)
          await defaultEventCallbacks.PAIR_INIT(syncInfo);
          console.log("syncInfo", syncInfo);
        },
      },
    },
  });


  // Showcase the Taquito Wallet API
  // In a real application, we wouldn't initialize the wallet in a method
  // but in a service, so it only happens once.
  async updateExchangeTypes() {
    Tezos.setWalletProvider(this.wallet);
    // Request permissions
    await this.wallet.requestPermissions({network : { type : NetworkType.DELPHINET }});
    // Get contract
    const contract = await Tezos.wallet.at(
      "KT1Sk5CfTfoNtqCC9UFSGVL1J4ErjYHkqHRW"
    );
    // Call a method on a contract
    const result = await contract.methods
      .updateEscrowType(
        this.exchangeType.type,
        this.exchangeType.commission
      )
      .send();

    this.taquitoOperationHash = result.opHash;
  }

  // Showcase the Taquito Wallet API
  // In a real application, we wouldn't initialize the wallet in a method
  // but in a service, so it only happens once.
  async buy(item: any) {
    const commission : number = item.price*3
    const slashing : number = item.price*5
    const total : number = (item.price*100 + commission + slashing)/100

    Tezos.setWalletProvider(this.wallet);
    // Request permissions
    await this.wallet.requestPermissions({network : { type : NetworkType.DELPHINET }});
    // Get contract
    const contract = await Tezos.wallet.at(
      "KT1Sk5CfTfoNtqCC9UFSGVL1J4ErjYHkqHRW"
    );

    // Call a method on a contract
    const result = await contract.methods
      .addNewExchange(
        item.domainName,
        item.type,
        item.price*1000000,
        item.seller
      )
      .send({ amount: total });
    
    item.bought = true;

  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>