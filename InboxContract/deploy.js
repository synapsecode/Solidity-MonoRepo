const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    process.env.ETHSECRETPHRASE,
    'https://rinkeby.infura.io/v3/7a5f64d05ed3407182ca8493b23cb6cc'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface)).deploy({ 
        data: bytecode, 
        arguments: ['Hi There!'] 
    }).send({gas:'300000', from: accounts[0]})

    console.log("Contract Deployed to: ", result.options.address)
}

deploy();

// Use to get test ETH -> https://rinkeby-faucet.com/
// Deployed to: 0xbD4B7b4a2fA5571904469A13caD36C2C85BD46EF