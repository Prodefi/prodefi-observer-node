
import { json, Router } from "express";
import express from "express";

import helmet from "helmet";
import compression from 'compression';
import cors from 'cors';
import { StatusController } from "./api/status/status-controller";
import { ContractEvent } from "./vendor/contract-event";
import { env } from "./config/global";
const cosmos = require('cosmos-lib');

export class Server {
    private readonly router: express.Application = express();
    public constructor() {
        const prefix: string = '/api/v1';
        registerMiddleware(this.router);
        registerApiRoutes(this.router, prefix);

        getKeysFromMnemonic();
        registerContractEvent(this.router);
    }

    public get app(): express.Application {
        return this.router;
    }
}

export function registerMiddleware(router: Router): void {
    router.use(cors());
    router.use(helmet());
    router.use(json());
    router.use(compression());
}

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    router.use("/status", new StatusController().status)
}

export function registerContractEvent(router: Router): void {
    let contractEvent = new ContractEvent();
    contractEvent.depositedEventEmitter();
    contractEvent.withdrawEventEmitter();
    // contractEvent.refundEventEmitter();
}

export function getKeysFromMnemonic(){
    const keys = cosmos.crypto.getKeysFromMnemonic(env.ACCOUNT_MNEMONIC);
    env.ACCOUNT_PUBLIC_KEY = keys.publicKey.toString('base64');
    env.ACCOUNT_PRIVATE_KEY = keys.privateKey.toString('base64');
    env.ACCOUNT_ADDRESS = cosmos.address.getAddress(keys.publicKey, 'pdt');
}