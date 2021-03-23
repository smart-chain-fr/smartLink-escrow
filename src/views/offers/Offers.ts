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
const user = namespace('user')

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
    public headers = ["Product", "Seller", "Total", "", ""];
    public period: string | null = "";
    public commissions_temp = new Map()
    public contractUtils = new contractUtils(this.$store.state.contract.contractAddress)
    public dataUtils = new dataUtils();
    public storage: any;

    @user.Action
    public updateViewed!: (item: string) => void

    @user.Action
    public updateRemoved!: (item: string) => void
    

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
        this.data = this.data.filter((data) => !exchanges.has(data.id) && data.type === "offer" && !this.$store.state.user.removed.includes(data.id))
        console.log(this.data)
        this.data.map((data) => {
            const commission = this.getCommission(data.escrow_type)
            this.dataUtils.updateDefaultData(data, commission, this.slashing_rate)
        })
    }

    async beforeMount() {
        this.storage = await this.contractUtils.getContractStorage();
        this.loadData();
        this.loadTable = false;
    }

    filteredEvents() {
        const today = moment();

        if (this.period == "day") {
            return this.data.filter(data => moment(data.date).toISOString().substr(0, 10) === today.toISOString().substr(0, 10))
        }
        else if (this.period == "week") {
            return this.data.filter(data => today.isoWeek() === moment(data.date).isoWeek())
        }
        else if (this.period == "month") {
            return this.data.filter(data => moment(data.date).toISOString().substr(0, 7) === today.toISOString().substr(0, 7))
        }
        else {
            return this.data
        }

    }

    updateNotification(id:string) {
        if(!this.$store.state.user.viewed.includes(id)) this.updateViewed(id);
    } 
    
    isUnviewed(id:string){
        return !this.$store.state.user.viewed.includes(id)
    }

    removeItem(id:string){
        if(!this.$store.state.user.removed.includes(id)) this.updateRemoved(id);
        this.loadData()
    }

}
