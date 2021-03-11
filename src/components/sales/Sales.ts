import { Component, Vue } from 'vue-property-decorator';
import goodsToBuy from "../../demo-data/goods-to-buy.json"

import { TezosToolkit } from "@taquito/taquito"
import moment from "moment"
import { namespace } from 'vuex-class'
  
const user = namespace('user')
const Tezos = new TezosToolkit("https://edonet.smartpy.io")

@Component
export default class Sales extends Vue {

    public drawer = true;
    public loadTable = true;
    public data = goodsToBuy;
    public error = false;
    public slashing_rate = 0;
    public headers = ["Product", "Seller", "Total", ""];
    public period : string | null = "";
    public commissions_temp:any = {}
   
    

    async getContractStorage()
    {
        const contract = await Tezos.contract.at(this.$store.state.user.contractAddress);
        const storage:any = await contract.storage();
        return storage;
    }
    async getSlashingRate()
    {
        const storage = await this.getContractStorage();
        const slashing_rate = storage.slashing_rate.toNumber();
        this.slashing_rate = slashing_rate;
    }

    async getCommissionFromContract(escrow_type:string)
    {
        const storage = await this.getContractStorage();
        const commission = await storage.escrow_types.get(escrow_type);
        return commission.toNumber();
    }

    async isTheItemBought(id:string)
    {
        const storage = await this.getContractStorage();
        const ongoing_exchanges = await storage.exchanges;
        const exchange = await ongoing_exchanges.get(id)
        let result = false;
        
        if (typeof exchange === 'undefined')
        {
            result = true;
        }
        else if (storage.exchanges.get(id).state === "CANCELLED")
        {
            result = true;
        }
        return result;
    }

    async removeBoughtItems()
    {
        const filterMap = await Promise.all(
            this.data.map(async data => {
              return await this.isTheItemBought(data.id);
            }),
          );

        return this.data.filter((_, index) => filterMap[index])
    }

    async getCommission(data_type:string)
    {
        let commission = 0;
        // get commission; we're using a temp object to avoid querying the contract too many times
        if(this.commissions_temp.hasOwnProperty(data_type))
        {
            commission = this.commissions_temp[data_type]
        }
        else
        {
            commission = await this.getCommissionFromContract(data_type);
            this.commissions_temp[data_type] = commission;
        }

        return commission;

    }

    async updateData()
    {
              
        // Removing all bought items
        this.data = await this.removeBoughtItems();

        for(let i=0; i<Object.keys(this.data).length; i++)
        {           
            let commission = await this.getCommission(this.data[i].type)
            let fees = this.data[i].shipping + this.data[i].price * (this.slashing_rate/100) + this.data[i].price* (commission/100)
           console.log(this.commissions_temp)
            Object.assign(this.data[i], {
                fees : fees.toFixed(2),
                total : this.data[i].price + fees
            }) 
        }
    }

    async beforeMount() {
        await this.getSlashingRate();
        await this.updateData();
        this.loadTable= false;
    }

    filteredEvents() {
        const today = moment();
        
        if(this.period == "day")
        {
            return this.data.filter(data => moment(data.date).toISOString().substr(0, 10) === today.toISOString().substr(0, 10))
        }
        else if(this.period == "week")
        {
            return this.data.filter(data => today.isoWeek() === moment(data.date).isoWeek())
        }
        else if(this.period == "month")
        {
            return this.data.filter(data => moment(data.date).toISOString().substr(0, 7) === today.toISOString().substr(0, 7))
        }
        else
        {
            return this.data
        }
        
      }
  
}
