import { Component, Vue } from 'vue-property-decorator';
import {
    BeaconEvent,
    defaultEventCallbacks,
    NetworkType
  } from "@airgap/beacon-sdk";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import contractCode from "../../contract/Escrow-contract.json"
  import { namespace } from 'vuex-class'
  
  const user = namespace('user')
  const Tezos = new TezosToolkit('https://edonet.smartpy.io')
  
@Component
export default class Home extends Vue {

    public wallets = {
        1: "https://airgap.it/",
        2: "https://cryptonomic.tech/galleon.html",
        3: "https://wallet.kukai.app/",
        4: "https://www.ledger.com/",
        5: "https://spirewallet.com/",
        6: "https://templewallet.com/"
    }
    
    public step = 1;

    public originating = false;

    public originatingCompleted = false;

    public address: string | null = "";

    @user.State
    public contractAddress!: string
  
    @user.Action
    public updateContract!: (contractAddress: string) => void

    private wallet = new BeaconWallet({
        name: "Escrow DApp",
        eventHandlers: {
          // Overwrite standard behavior of certain events
          [BeaconEvent.PAIR_INIT]: {
            handler: async (syncInfo) => {
              // Add standard behavior back (optional)
              await defaultEventCallbacks.PAIR_INIT(syncInfo);
              console.log("syncInfo", syncInfo);
            },
          },
        },
      });
      
    async originateContract() {
        Tezos.setWalletProvider(this.wallet);
        // Request permissions
        const permission = await this.wallet.client.requestPermissions({network : { type : NetworkType.EDONET }});
        this.address = permission.address;
        const originationOp = await Tezos.wallet
        .originate({
            code: contractCode,
            init: {
                "prim": "Pair",
                "args": [
                  {
                    "prim": "Pair",
                    "args": [
                      [
                        { "prim": "Elt", "args": [ { "int": "0" }, { "string": "WAITING_FOR_TRANSFER" } ] },
                        { "prim": "Elt", "args": [ { "int": "1" }, { "string": "WAITING_FOR_VALIDATION" } ] },
                        { "prim": "Elt", "args": [ { "int": "2" }, { "string": "VALIDATED" } ] },
                        { "prim": "Elt", "args": [ { "int": "3" }, { "string": "CANCELLED" } ] }
                      ],
                      [
                        { "prim": "Elt", "args": [ { "string": "DOMAIN_NAME" }, { "int": "3" } ] },
                        { "prim": "Elt", "args": [ { "string": "OBJECT" }, { "int": "5" } ] },
                        { "prim": "Elt", "args": [ { "string": "OTHER" }, { "int": "5" } ] }
                      ]
                    ]
                  },
                  { "prim": "Pair", "args": [ [], { "prim": "Pair", "args": [ { "string": this.address }, { "int": "5" } ] } ] }
                ]
              }
        })
        .send();
        this.originating = true;
        
        const contract = await originationOp.contract();
        //this.contractAddress = contract.address;
        this.updateContract(contract.address)
        this.originating = false;
        this.originatingCompleted = true;
    }

}
