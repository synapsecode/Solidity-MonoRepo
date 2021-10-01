const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Constructor
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    // console.log("==== Fetched accounts ====")
    // console.log(accounts);

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi There!'] })
        .send({ from: accounts[0], gas: '1000000' }) //1M Gas
})

describe('InboxContract', () => {
    it('It Deploys a Contract to Ethereum', () => {
        // console.log(inbox);
    })

    it('It has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi There!')
    })

    it('It can change the message', async () => {
        // Send new Message
        await inbox.methods.setMessage('Bye').send({ from: accounts[0] })
        // Receive the new message!
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye')
    })
})