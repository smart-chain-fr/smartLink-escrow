import { TezosToolkit } from "@taquito/taquito"
import moment from "moment"
import { namespace } from 'vuex-class'
  
const user = namespace('user')

const Tezos = new TezosToolkit("https://edonet.smartpy.io")

export default class contractUtils{
    public contractAddress : string;

    constructor(contractAddress:string){
        this.contractAddress = contractAddress
    }

    public async getContractStorage()
    {
        const contract = await Tezos.contract.at(this.contractAddress);
        const storage:any = await contract.storage();
        return storage;
    }
    public async getSlashingRate()
    {
        const storage = await this.getContractStorage();
        const slashing_rate = storage.slashing_rate.toNumber();
        return slashing_rate;
    }

    public async getCommissionFromContract(escrow_type:string)
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

}
