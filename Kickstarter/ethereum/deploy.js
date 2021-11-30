const HDWalletProvider = require('@truffle/hdwallet-provider');
const { exit } = require('process');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    process.env.ETHSECRETPHRASE,
    'https://rinkeby.infura.io/v3/0f7c0b8915304b14b98f163fb5772495'
);
const web3 = new Web3(provider);

const deploy = async (gas) => {
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({ 
        data: compiledFactory.bytecode, 
        arguments: [], 
    }).send({gas:gas, gasPrice:'5000000000', from: accounts[0]})

    console.log("Contract Deployed to: ", result.options.address)
    exit(0);
}

deploy(gas='1000000');


// Deployed To Address: 0x9A4572Ce027726A68e9fAB3Dc9b01Ddd64ce4C56