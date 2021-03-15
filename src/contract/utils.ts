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
    public getSlashingRate(storage:any)
    {
        const slashing_rate = storage.slashing_rate.toNumber();
        return slashing_rate;
    }

    public async getCommissionFromContract(storage:any, escrow_type:string)
    {
        const commission = await storage.escrow_types.get(escrow_type);
        return commission.toNumber();
    }

    public getAllExchanges(storage:any)
    {
        const ongoing_exchanges = storage.exchanges;
        return ongoing_exchanges;
    }

    public getAllItemsForStateWithBuyer(storage:any, state:string)
    {
        //let items : Array<string> = []
        let items = new Map()
        const ongoing_exchanges = this.getAllExchanges(storage)
        const keys = ongoing_exchanges.keyMap.keys()
        for(const key of keys)
        {
            let item = ongoing_exchanges.get(key.replace(/"/g,""))
            if(typeof item !== 'undefined')
            {
                if(item.state === state)
                { 
                    //items.push(key.replace(/"/g,""))
                    items.set(key.replace(/"/g,""), {buyer: item.buyer, total: item.paid_price.escrow.toNumber()/1000000, update: new Date(item.lastUpdate).toLocaleString()})
                }
            }
            
        }

        return items;
        
    }

    public isTheItemBought(storage:any, id:string)
    {
        const ongoing_exchanges = this.getAllExchanges(storage)
        const exchange = ongoing_exchanges.get(id)
        let result = false;
        
        if (typeof exchange === 'undefined')
        {
            result = true;
        }
        else if (ongoing_exchanges.get(id).state === "CANCELLED")
        {
            result = true;
        }
        return result;
    }

}
