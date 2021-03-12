import { Component, Vue } from 'vue-property-decorator';
import goodsToBuy from "../../demo-data/goods-to-buy.json"
import contractUtils from "../../contract/utils"

import { TezosToolkit } from "@taquito/taquito"
import moment from "moment"
import { namespace } from 'vuex-class'
  
const user = namespace('user')
const Tezos = new TezosToolkit("https://edonet.smartpy.io")

@Component
export default class Sales extends Vue {

    public drawer = true;

    public data = goodsToBuy;
   
    public contractUtils = new contractUtils(this.$store.state.user.contractAddress)
    public itemsWaitingForValidation = new Map()
    public itemsWaitingForTransfer = new Map()
    public headers = ["Item", "Escrowed amount", ""]
    public storage:any;
    async beforeMount()
    {
        this.storage = await this.contractUtils.getContractStorage();
        this.itemsWaitingForTransfer = this.contractUtils.getAllItemsWaitingForTransferWithBuyer(this.storage)
        this.itemsWaitingForValidation = this.contractUtils.getAllItemsWaitingForValidationWithBuyer(this.storage)
    }

    
    filteredData(type:string)
    {

        if ( type === "transfer")
        {
            let data = this.data.filter(data => Array.from(this.itemsWaitingForTransfer.keys()).includes(data.id))
            data.map(data => Object.assign(data, this.itemsWaitingForTransfer.get(data.id)))
            return data
        
        }
        else if (type === "validation")
        {
            let data = this.data.filter(data => Array.from(this.itemsWaitingForValidation.keys()).includes(data.id))
            data.map(data => Object.assign(data, this.itemsWaitingForValidation.get(data.id)))
            return data
        }   
        else 
        {
            return this.data
        }
    }
  
}
