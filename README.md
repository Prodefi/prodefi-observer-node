# PRODEFI OBSERVER NODE
   The prodefi-block-explorer that can run in NodeJS. It is based on TypeScript, JavaScript, Express, web3.js and Infura (https://infura.io/).

   web3.js is a collection of libraries which allow you to interact with a local or remote ethereum node, using a HTTP or IPC connection

   The project is using one of the most popular database is PostgreSQL. Additional it is run node server with PM2. PM2 is a daemon process manager that will help you manage and keep your application online.

### Setup
- Checking out following guide to setup Nodejs: https://nodejs.org/en/download/
- Checking out following guide to setup MongoDB: https://docs.mongodb.com/manual/installation/
- Checking out following guide to setup PM2: https://pm2.keymetrics.io/
- Sign up and create a infura project at https://infura.io/

### Environment variables
- All environment variables is defined at ecosystem.config.js file:
   + NODE_ENV: It have 2 value: development or production.
   + NODE_PORT: start the project at .... in server.

   + ROPSTEN_INFURA_WS: Ex: wss://ropsten.infura.io/ws/v3/{your infura project id}
   + CONTRACT_ADDRESS: "0xa3934e78ab3d4add20aa0bfb75854ee887d9bca0" 

   + DB_USERNAME
   + DB_PASSWORD
   + DB_HOST: your PostgreSQL database server.
   + DB_PORT: your PostgreSQL database port.
   + DB_DATABASE: your PosgreSQL database name.

   + REPORT_URL: (your tendermint blockchain server).
   + CHAIN_ID
   + ACCOUNT_MNEMONIC

### Setup production
- Navigate to folder contains package.json file.
- Change enviroment variables at ecosystem.config.js file.
- Run command: yarn install or npm install
- Run command: yarn build or npm run build . The project will generate a folder name: dist
- Start project with pm2: pm2 start ecosystem.config.js --env production
- Stop project with pm2: pm2 stop prodefi-observer-node
- Delete project with pm2: pm2 delete prodefi-observer-node

### Advance PM2 command
- pm2 logs
- pm2 list