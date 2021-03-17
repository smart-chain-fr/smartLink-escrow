import { Component, Vue } from 'vue-property-decorator';
import offers from "../../demo-data/offers.json"
import contractUtils from "../../contract/utils"

import { TezosToolkit } from "@taquito/taquito"
import {
    BeaconEvent,
    defaultEventCallbacks,
    NetworkType
  } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";

import { namespace } from 'vuex-class'

const contract = namespace('contract')
const Tezos = new TezosToolkit("https://edonet.smartpy.io")

@Component
export default class Sales extends Vue {

    public drawer = true;

    public data = offers;
   
    public contractUtils = new contractUtils(this.$store.state.contract.contractAddress)
    public itemsWaitingForValidation:any={}
    public itemsWaitingForTransfer:any = {}
    public headers = ["Item", "Buyer", "Escrowed amount", ""]
    public storage:any;
    public render = 0;
    public loadTable = true;
    public confirmation = false

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
        await this.loadItems()
        this.loadTable = false;
    }

    async loadItems()
    {
        this.storage = await this.contractUtils.getContractStorage();
        console.log(this.storage)
        this.itemsWaitingForTransfer = this.getItems("WAITING_FOR_TRANSFER")
        this.itemsWaitingForValidation = this.getItems("WAITING_FOR_VALIDATION")
    }
    
    getItems(state:string)
    {
        const itemsInfo = this.contractUtils.getAllItemsForStateWithBuyer(this.storage,state)
        let data = this.data.filter(data => Array.from(itemsInfo.keys()).includes(data.id))
        data.map(data=> Object.assign(data, itemsInfo.get(data.id), {confirmation:false}));
        console.log(data)
        return data;
       
    }
    
    setConfirmation(items:any, id:string, state:boolean)
    {
        return items.map(
            (data: { id: string; confirmation: boolean; })=> {
                if(data.id===id) {
                    data.confirmation = state
                } 
                return data
            });
    }

    async validateExchange(id:string)
    {
        this.itemsWaitingForValidation = this.setConfirmation(this.itemsWaitingForValidation, id, true)

        Tezos.setWalletProvider(this.wallet);
        // Request permissions

        await this.wallet.client.requestPermissions({network : { type : NetworkType.EDONET }})
        .then(() => Tezos.wallet.at(this.$store.state.contract.contractAddress))
        .then((contract)=> contract.methods.validateExchange(
                    id
            )
        )
        .then((transaction)=> transaction.send())
        .then((operation)=> operation.confirmation())
        .then(()=>{
            this.itemsWaitingForValidation = this.setConfirmation(this.itemsWaitingForValidation, id, false)
            this.loadItems()
        })
        .catch((error) => 
        {
            console.log(error)
            this.itemsWaitingForValidation = this.setConfirmation(this.itemsWaitingForValidation, id, false)
        })
    }

    async validateSellerTransmission(id:string)
    {
        this.itemsWaitingForTransfer = this.setConfirmation(this.itemsWaitingForTransfer, id, true)

        Tezos.setWalletProvider(this.wallet);
        // Request permissions

        await this.wallet.client.requestPermissions({network : { type : NetworkType.EDONET }})
        .then(() => Tezos.wallet.at(this.$store.state.contract.contractAddress))
        .then((contract)=> contract.methods.validateSellerTransmission(
                    id
                )
        )
        .then((transaction)=> transaction.send())
        .then((operation)=> operation.confirmation())
        .then(()=>{
            this.itemsWaitingForTransfer = this.setConfirmation(this.itemsWaitingForTransfer, id, false)
            this.loadItems()
        })
        .catch((error) => 
        {
            console.log(error)
            this.itemsWaitingForTransfer = this.setConfirmation(this.itemsWaitingForTransfer, id, false)
        })
    }
  
}
