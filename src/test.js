"use strict";
/* import { RpcClient } from '@taquito/rpc';

const client = new RpcClient('https://delphinet.smartpy.io')

const balance = client.getBalance('tz1VLCwEegxpLH9gepjWbyqwn9w1qbcmRN3U').then((balance) => {console.log('-- Balance:', balance.toNumber())} )
 */
exports.__esModule = true;
var taquito_1 = require("@taquito/taquito");
var Tezos = new taquito_1.TezosToolkit("https://edonet.smartpy.io");
var contract = Tezos.contract.at("KT1H8kLur4dn82HPD8Lu9w2g9fkWSCMTTPHt")
    .then(function (contract) {
    contract.storage()
        .then(function (storage) {
            const stuff = storage.escrow_types.get("DOMAIN_NAME").then(function (commission){console.log(commission.toNumber())})
            
        });
});
