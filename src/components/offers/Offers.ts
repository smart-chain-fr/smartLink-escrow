import { Component, Vue } from 'vue-property-decorator';
import offers from "../../demo-data/offers.json"
import states from "../../demo-data/states.json"

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
    public data = offers;
    public states: any = states;
    public error = false;
    public headers = ["Product", "Seller", "Total", ""];
    public period: string | null = "";
    public commissions_temp = new Map()
    public contractUtils = new contractUtils(this.$store.state.user.contractAddress)
    public storage: any;

    async getCommission(data_type: string) {
        let commission = 0;

        // get commission; we're using a temp object to avoid querying the contract too many times
        if (this.commissions_temp.has(data_type)) {
            commission = this.commissions_temp.get(data_type)
        }
        else {
            commission = await this.contractUtils.getCommissionFromContract(this.storage, data_type);
            this.commissions_temp.set(data_type, commission)
        }

        return commission;

    }

    mutezToTez(mutez: number) {
        return mutez / 1000000;
    }

    async updateDefaultData(data: any) {
        let commission = await this.getCommission(data.type)
        let fees = data.shipping + data.price * ((this.slashing_rate / 100) + (commission / 100))
        Object.assign(data, {
            state_name: this.states['default'].name,
            commission: commission,
            slashing: this.slashing_rate,
            total: data.price + fees,
            fees: fees.toFixed(2)
        })
    }

    updateDataWithExchange(data: any, exchange: any) {
        data.date = exchange.lastUpdate
        Object.assign(data, {
            state_name: this.states[exchange.state].name,
            commission: this.mutezToTez(exchange.paid_price.commission),
            slashing: this.mutezToTez(exchange.paid_price.slashing),
            total: this.mutezToTez(exchange.paid_price.escrow),
            fees: (data.shipping + this.mutezToTez(exchange.paid_price.slashing) + this.mutezToTez(exchange.paid_price.commission)).toFixed(2)
        })
    }

    async loadData() {
        const exchanges = this.contractUtils.getAllExchangesMap(this.storage)
        await Promise.all(
            this.data.map(async (data) => {
                if (exchanges.has(data.id)) {
                    const exchange = exchanges.get(data.id)
                    this.updateDataWithExchange(data, exchange)
                }
                else {
                    await this.updateDefaultData(data)
                }
            }))
    }


    async beforeMount() {
        this.storage = await this.contractUtils.getContractStorage();
        this.slashing_rate = this.contractUtils.getSlashingRate(this.storage);
        await this.loadData();
        console.log(this.data)
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

}
