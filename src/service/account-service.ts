import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class AccountService {
    
    getAccountNumberAndSequence = (address: String) => {

        const apiLink = `${env.REPORT_URL}/auth/accounts/${address}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    const result = {
                        accountNumber: response.data.result.value.account_number,
                        sequence: response.data.result.value.sequence
                    }
                    resolve(result);
                } else{
                    reject({message: "Wrong data response!..."});
                }
            }).catch(err => {
                logger.error(`reportETHDeposit with error: ${err}`)
                reject(err);
            });
        });
    }
}

const accountService = new AccountService();

export default accountService;