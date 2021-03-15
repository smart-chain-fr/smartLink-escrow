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

    public slashing_rate = 0
    public loadTable = true;
    public data = goodsToBuy;
    public error = false;
    public headers = ["Product", "Seller", "Total", ""];
    public period : string | null = "";
    public commissions_temp:any = {}
    public contractUtils = new contractUtils(this.$store.state.user.contractAddress)
    public storage:any;

    async removeBoughtItems()
    {
        const filterMap = await Promise.all(
            this.data.map(async data => {
              return this.contractUtils.isTheItemBought(this.storage, data.id);
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
            commission = await this.contractUtils.getCommissionFromContract(this.storage, data_type);
            this.commissions_temp[data_type] = commission;
        }

        return commission;

    }

    async updateData()
    {
        // Removing all bought items
        //this.data = await this.removeBoughtItems();
        this.data = this.data.filter((data) => this.contractUtils.isTheItemBought(this.storage, data.id))
        for(let i=0; i<Object.keys(this.data).length; i++)
        {           
            //let commission = await this.getCommission(this.data[i].type)
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
        this.storage = await this.contractUtils.getContractStorage();
        this.slashing_rate =this.contractUtils.getSlashingRate(this.storage);
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
