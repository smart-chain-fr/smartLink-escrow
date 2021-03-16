import { Component, Vue } from 'vue-property-decorator';
import {
    BeaconEvent,
    defaultEventCallbacks,
    NetworkType
  } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";

import goodsToBuy from "../../demo-data/goods-to-buy.json"
import contractUtils from "@/contract/utils"
import { TezosToolkit } from "@taquito/taquito"

const Tezos = new TezosToolkit("https://edonet.smartpy.io")

@Component
export default class Buy extends Vue {

    public drawer = true;

    public contractUtils = new contractUtils(this.$store.state.user.contractAddress)
    public storage:any;
    public info = {
        "DOMAIN_NAME": {
            color: "primary",
            name: "Domain name",
            description: "Until the domain name has been transferred by the Seller to the Buyer, SmartLink's smart contract will hold the payment. SmartLink is connected to the WHOIS database and ensures a seemless transfer for both parties."
        },
        "OTHER": {
            name: "Other",
            description: "Until the transferred has been confirmed by the Seller to the Buyer, SmartLink's smart contract will hold the payment."
        },
        "OBJECT": {
            name: "Object",
            description: "Until the object has been transferred by the Seller to the Buyer, SmartLink's smart contract will hold the payment."
        },
    }

    public id = this.$route.params.id
    public data = goodsToBuy.find(data => data.id === this.$route.params.id)
    public isItemAvailable = false;
    public loaded = false;
    public commission = 0
    public slashing_rate = 0
    public fees = 0
    public total = 0
    public isPaymentInProcess= false;
    public isPaymentSuccessful= false;
    public paymentFailed = false;
    

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

    async beforeMount()
    {
        this.storage = await this.contractUtils.getContractStorage()
        if (typeof this.data !== 'undefined')
        {
            this.isItemAvailable =  this.contractUtils.isTheItemBought(this.storage, this.id)
            this.commission = await this.contractUtils.getCommissionFromContract(this.storage, this.data!.type);
            this.slashing_rate =  this.contractUtils.getSlashingRate(this.storage);
            this.fees = this.data!.price*(this.slashing_rate/100) + this.data!.price*(this.commission/100)
            this.total = this.data!.price + this.fees
        }
        this.loaded = true; 
        
    }

    async buy()
    {
        this.isPaymentInProcess = true;
        Tezos.setWalletProvider(this.wallet);
        // Request permissions
        await this.wallet.client.requestPermissions({network : { type : NetworkType.EDONET }})
          .then(()=> Tezos.wallet.at(this.$store.state.user.contractAddress))
          .then((contract)=>
            contract.methods.addNewExchange(
            this.data!.type,
            this.data!.id,
            this.data!.name,
            this.data!.price*1000000,
            this.data!.seller
          ))
          .then((transaction)=>transaction.send({amount: this.total}))
          .then((operation)=>operation.confirmation())
          .then(()=>{
            this.isPaymentSuccessful = true;
            this.isPaymentInProcess = false;
          })
          .catch((error)=>{
            console.log(error);
            this.isPaymentSuccessful = false; this.paymentFailed =true
          });
    }

    
}