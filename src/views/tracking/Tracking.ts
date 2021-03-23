import { Component, Vue } from 'vue-property-decorator';
import offers from "../../demo-data/offers.json"
import states from "../../demo-data/states.json"

import contractUtils from "../../contract/utils"
import dataUtils from "../../demo-data/utils"

import { TezosToolkit } from "@taquito/taquito"
import moment from "moment"
import { namespace } from 'vuex-class'
import Navigation from '@/components/navigation/Navigation.vue';

const contract = namespace('contract')
const Tezos = new TezosToolkit("https://edonet.smartpy.io")

@Component({
    components: {
        Navigation
    },
})
export default class Sales extends Vue {

    public drawer = true;

    public slashing_rate = this.$store.state.contract.slashingRate
    public loadTable = true;
    public data = offers;
    public states: any = states;
    public error = false;
    public headers = ["Product", "Seller", "State", "Total", ""];
    public offers_period: string | null = "";
    public purchases_period: string | null = "";
    public commissions_temp = new Map()
    public contractUtils = new contractUtils(this.$store.state.contract.contractAddress)
    public dataUtils = new dataUtils();
    public storage: any;

    getCommission(data_type: string) {
        let commission = 0;

        // get commission; we're using a temp object to avoid querying the contract too many times
        if (this.commissions_temp.has(data_type)) {
            commission = this.commissions_temp.get(data_type)
        }
        else {
            commission = this.contractUtils.getCommission(this.storage, data_type);
            this.commissions_temp.set(data_type, commission)
        }

        return commission;

    }

    loadData() {
        const exchanges = this.contractUtils.getMap(this.storage, "exchanges")
        this.data = this.data.filter((data) => exchanges.has(data.id))
        console.log(this.data)
        this.data.map((data) => {
            const exchange = exchanges.get(data.id)
            this.dataUtils.updateDataWithExchange(data, exchange)
        })
    }


    async beforeMount() {
        this.storage = await this.contractUtils.getContractStorage();
        this.loadData();
        this.loadTable = false;
    }

    filteredEvents(type:string) {
        const today = moment();
        const data = this.data.filter(data => data.type === type)
        const period = (type === 'offer')? this.offers_period:this.purchases_period
        
        if (period == "day") {
            return data.filter(data => moment(data.date).toISOString().substr(0, 10) === today.toISOString().substr(0, 10))
        }
        else if (period == "week") {
            return data.filter(data => today.isoWeek() === moment(data.date).isoWeek())
        }
        else if (period == "month") {
            return data.filter(data => moment(data.date).toISOString().substr(0, 7) === today.toISOString().substr(0, 7))
        }
        else {
            return data
        }

    }

}
