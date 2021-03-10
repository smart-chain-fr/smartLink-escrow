import { Component, Vue } from 'vue-property-decorator';
import goodsToBuy from "../../demo-data/goods-to-buy.json"

import { TezosToolkit } from "@taquito/taquito"

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
    public contract = this.$route.params.address
}