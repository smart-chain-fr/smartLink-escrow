/* import { RpcClient } from '@taquito/rpc';

const client = new RpcClient('https://delphinet.smartpy.io')

const balance = client.getBalance('tz1VLCwEegxpLH9gepjWbyqwn9w1qbcmRN3U').then((balance) => {console.log('-- Balance:', balance.toNumber())} )
 */

import { TezosToolkit } from "@taquito/taquito"
const Tezos = new TezosToolkit("https://edonet.smartpy.io")

const contract = Tezos.contract.at("KT1GyCKEirRt6oW2xmPUBtZUE4BENUd7484T")
.then((contract)=> { contract.storage()
    .then((storage:any)=>{console.log(storage.slashing_rate.toNumber())})} )

