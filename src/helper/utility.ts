import { EventEmitter } from "./../entity/event-emiter";
import { env } from "../config/global";
const cosmos = require('cosmos-lib');

export class UtilityService {
    /**
   * Create EventEmitter
   *
   * @param {eventData} Object
   * @param {contractEventType} ContractEventType
   * 
   * @returns {EventEmitter}
   */
    public static createEventEmitter(eventData: any, contractEventType: number): EventEmitter {
        let eventEmitter = new EventEmitter();
        eventEmitter.type = contractEventType;
        eventEmitter.tx_index = eventData.transactionIndex;
        eventEmitter.tx_hash = eventData.transactionHash;
        eventEmitter.block_hash = eventData.blockHash;
        eventEmitter.block_number = eventData.blockNumber;
        eventEmitter.from_address = eventData.returnValues['0'];
        eventEmitter.to_address = eventData.address;
        eventEmitter.amount = eventData.returnValues.amount;
        eventEmitter.contract_address = eventData.returnValues.tokenAddress;
        eventEmitter.signature = eventData.signature;

        eventEmitter.idx = eventData.returnValues.idx;
        eventEmitter.id_log = eventData.id;
        return eventEmitter;
    }

    /**
   * Create Report Transaction
   *
   * @param {eventData} Object
   * @param {contractEventType} ContractEventType
   * 
   * @returns {EventEmitter}
   */
    public static createReportTransaction(eventData: any, transactionType: String): any {
        const address = parseInt(eventData.returnValues['3']) > 0 ? eventData.returnValues['3'] : env.ETH_ADDRESS
        const reportTransaction = {
            base_req: {
                from: env.ACCOUNT_ADDRESS,
                chain_id: env.CHAIN_ID,
            },
            address: address,
            hash: eventData.transactionHash,
            block: eventData.blockNumber.toString(),
            from_address: eventData.returnValues['0'],
            to_address: eventData.address,
            value: eventData.returnValues.amount,
            type: transactionType
        }

        return reportTransaction;
    }

        /**
       * Generate Transaction Signature
       *
       * @param {eventData} Object
       * @param {contractEventType} ContractEventType
       * 
       * @returns {EventEmitter}
       */
      public static generateSignature(rs: any): String {
        const signature = cosmos.crypto.signJson(this.sortObject({
            account_number: rs[1].accountNumber,
            chain_id: env.CHAIN_ID,
            fee: rs[0].value.fee,
            memo: rs[0].value.memo,
            msgs: rs[0].value.msg,
            sequence: rs[1].sequence
        }), Buffer.from(env.ACCOUNT_PRIVATE_KEY, 'base64'));
        return signature.toString('base64');
    }

    /**
       * Create SignTx
       *
       * @param {eventData} Object
       * @param {contractEventType} ContractEventType
       * 
       * @returns {EventEmitter}
       */
    public static createSignTx(rs: any, signature: String): any {
        const signTx = {
            tx: {
                msg: rs[0].value.msg,
                fee: rs[0].value.fee,
                memo: rs[0].value.memo,
                signatures: [{
                    signature: signature,
                    pub_key: {
                        type: "tendermint/PubKeySecp256k1",
                        value: env.ACCOUNT_PUBLIC_KEY
                    },
                    account_number: rs[1].accountNumber,
                    sequence: rs[1].sequence
                }]
            },
            mode: 'block'
        }
        return signTx;
    }


    /**
       * Create SignTx
       *
       * @param {eventData} Object
       * @param {contractEventType} ContractEventType
       * 
       * @returns {EventEmitter}
       */
      public static sortObject(obj: any): any {
        if (obj === null) return null;
        if (typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(x => this.sortObject(x));
        const sortedKeys = Object.keys(obj).sort();
        const result: any = {};
        sortedKeys.forEach(key => {
            result[key] = this.sortObject(obj[key])
        });
        return result;
    }

}