import { TezosToolkit } from "@taquito/taquito"

const Tezos = new TezosToolkit("https://edonet.smartpy.io")

export default class contractUtils {
    public contractAddress: string;

    constructor(contractAddress: string) {
        this.contractAddress = contractAddress
    }

    public async getContractStorage() {
        const contract = await Tezos.contract.at(this.contractAddress);
        const storage: any = await contract.storage();
        return storage;
    }

    public getSlashingRate(storage: any) {
        const slashing_rate = storage.slashing_rate.toNumber();
        return slashing_rate;
    }

    public getCommissionFromContract(storage: any, escrow_type: string) {
        const commission = storage.escrow_types.get(escrow_type);
        return commission.toNumber();
    }

    public getMap(storage: any, data_name:string) {
        let items = new Map()

        const data = storage[data_name]
        const keys = data.keyMap.keys()

        for (let key of keys) {

            key = key.replace(/"/g, "")
            let item = data.get(key)
            if (typeof item !== 'undefined') {
                items.set(key, item)
            }
        }
        return items;
    }  

    public getAllItemsForStateWithBuyer(storage: any, state: string) {
        //let items : Array<string> = []
        let items = new Map()
        const ongoing_exchanges = storage.exchanges
        const keys = ongoing_exchanges.keyMap.keys()
        for (const key of keys) {
            let item = ongoing_exchanges.get(key.replace(/"/g, ""))
            if (typeof item !== 'undefined') {
                if (item.state === state) {
                    //items.push(key.replace(/"/g,""))
                    items.set(key.replace(/"/g, ""), { buyer: item.buyer, total: item.paid_price.escrow.toNumber() / 1000000, update: new Date(item.lastUpdate).toLocaleString() })
                }
            }

        }

        return items;
    }

}
