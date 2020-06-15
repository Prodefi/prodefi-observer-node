import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class TransactionService {
    
    addTransaction = (data: any, address:String) => {

        const apiLink = `${env.REPORT_URL}/crosschain/tokens/${address}/add-transaction`;
        return new Promise<any | null>((resolve, reject) => {
            axios.post(apiLink, data).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`reportETHDeposit with error: ${err}`);
                reject(err);
            });
        });
    }

    signTransaction = (data: any) => {
        const apiLink = `${env.REPORT_URL}/txs`;
        return new Promise<any | null>((resolve, reject) => {
            axios.post(apiLink, data).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                } else {
                    reject({message: "Wrong data response!..."});
                }
            }).catch(err => {
                logger.error(`signTransaction with error: ${err}`)
                reject(err);
            });
        });
    }
}

const transactionService = new TransactionService();

export default transactionService;