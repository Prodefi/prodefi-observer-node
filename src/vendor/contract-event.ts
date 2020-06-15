import Web3 from 'web3';
import { env, ContractEventType } from '../config/global';
import { Repository, getManager } from 'typeorm';
import { EventEmitter } from '../entity/event-emiter';
import { logger } from '../config/logger';
import transactionService from '../service/transaction-service';
import accountService from '../service/account-service';
import { UtilityService } from '../helper/utility';

export class ContractEvent {

    private readonly eventRepository: Repository<EventEmitter> = getManager().getRepository(EventEmitter);

    public depositedEventEmitter() {
        let web3 = new Web3(env.ROPSTEN_INFURA_WS);
        const abi = JSON.parse(env.ABI);
        let contract = new web3.eth.Contract(abi, env.CONTRACT_ADDRESS);
        contract.events.Deposited({ fromBlock: 0, toBlock: 'latest' }, (err: Error, data: any) => {
            if (err) {
                logger.error("---------Listen deposit event with error---------");
                logger.error(err);
            } else {
                const eventEmitter = UtilityService.createEventEmitter(data, ContractEventType.DEPOSITE);
                const address = parseInt(data.returnValues['3']) > 0 ? data.returnValues['3'] : env.ETH_ADDRESS;
                const reportTransaction = UtilityService.createReportTransaction(data, 'deposit');

                try {
                    logger.info("Starting to insert deposit event!...");
                    logger.info(JSON.stringify(eventEmitter));                   
                    Promise.all([
                        transactionService.addTransaction(reportTransaction, address),
                        accountService.getAccountNumberAndSequence(env.ACCOUNT_ADDRESS)
                    ]).then((rs: any) => {
                        const signature = UtilityService.generateSignature(rs);
                        const signTx = UtilityService.createSignTx(rs, signature);
                        Promise.all([
                            this.eventRepository.insert(eventEmitter),
                            transactionService.signTransaction(signTx)
                        ])
                    })
                        
                } catch (err) {
                    logger.error("---------Can't finish deposit event below---------");
                    logger.error(data);
                }
            }

        })

    }

    public withdrawEventEmitter() {
        let web3 = new Web3(env.ROPSTEN_INFURA_WS);
        const abi = JSON.parse(env.ABI);
        let contract = new web3.eth.Contract(abi, env.CONTRACT_ADDRESS);
        contract.events.Withdraw({ fromBlock: 0, toBlock: 'latest' }, (err: Error, data: any) => {
            if (err) {
                logger.error("---------Listen withdraw event with error---------");
                logger.error(err);
            } else {
                const eventEmitter = UtilityService.createEventEmitter(data, ContractEventType.WITHDRAWN);
                const address = parseInt(data.returnValues['3']) > 0 ? data.returnValues['3'] : env.ETH_ADDRESS;
                const reportTransaction = UtilityService.createReportTransaction(data, 'withdrawn');
                try {
                    logger.info("Starting to insert a withdrawn event!...")
                    logger.info(JSON.stringify(eventEmitter))

                    Promise.all([
                        transactionService.addTransaction(reportTransaction, address),
                        accountService.getAccountNumberAndSequence(env.ACCOUNT_ADDRESS)
                    ]).then((rs: any) => {
                        const signature = UtilityService.generateSignature(rs);
                        const signTx = UtilityService.createSignTx(rs, signature);
                        Promise.all([
                            this.eventRepository.insert(eventEmitter),
                            transactionService.signTransaction(signTx)
                        ])
                    })

                } catch (dbErr) {
                    logger.error("---------Can't insert withdraw event---------");
                    logger.error(dbErr);
                }
            }
        })

    }

    // public refundEventEmitter() {
    //     let web3 = new Web3(env.ROPSTEN_INFURA_WS);
    //     const abi = JSON.parse(env.ABI)
    //     let contract = new web3.eth.Contract(abi, env.CONTRACT_ADDRESS);
    //     contract.events.Refund({ fromBlock: 0, toBlock: 'latest' }, (err: Error, data: any) => {
    //         if (err) {
    //             logger.error("---------Listen refund event with error---------");
    //             logger.error(err);
    //         } else {
    //             const eventEmitter = UtilityService.createEventEmitter(data, ContractEventType.REFUND);
    //             const address = parseInt(data.returnValues['3']) > 0 ? data.returnValues['3'] : env.ETH_ADDRESS;
    //             const reportTransaction = UtilityService.createReportTransaction(data, 'refund');

    //             try {
    //                 logger.info("Starting to insert refund event!...");
    //                 logger.info(JSON.stringify(eventEmitter));
                   
    //                 Promise.all([
    //                     transactionService.addTransaction(reportTransaction, address),
    //                     accountService.getAccountNumberAndSequence(env.ACCOUNT_ADDRESS),
    //                     this.eventRepository.insert(eventEmitter)
    //                 ]).then((rs: any) => {
    //                     const signature = UtilityService.generateSignature(rs);
    //                     const signTx = UtilityService.createSignTx(rs, signature);
    //                     transactionService.signTransaction(signTx);
    //                 })

    //             } catch (dbErr) {
    //                 logger.error("---------Can't insert refund event---------");
    //                 logger.error(dbErr);
    //             }
    //         }
    //     })

    // }

}