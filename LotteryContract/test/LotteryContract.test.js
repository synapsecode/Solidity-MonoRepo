const assert = require('assert');
const ganache = require('ganache-cli');
const { exit } = require('process');
const Web3 = require('web3'); //Constructor
const web3 = new Web3(ganache.provider()) //Instance(GanacheProvider)
const { interface, bytecode } = require('../compile');

let accounts;
let compiledContract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    args = []; //Arguments to the Contract constructor
    fees = '1000000'
    compiledContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: args })
        .send({ from: accounts[0], gas: fees })
})

describe('LotteryContract', () => {
    it('Deployed to Ganache Network', () => {
        assert.ok(compiledContract.options.address)
    })

    it('Manager is the original contract sender', async ()=>{
        const manager = value = await compiledContract.methods.manager().call();
        assert(manager == accounts[0]);
    })

    it('People who pledge insufficient funds are not allowed', async () => {
        try{
            const res = await compiledContract.methods.enter().send({
                from:accounts[1],
                value: web3.utils.toWei(0.0001, 'ether'), //0.00001ETH < 0.0001ETH (Limit)
            });
            assert(false);
        }catch(e){ assert(e); }
    })

    it('pickWinner can be called by manager only', async ()=>{
        // Alice & Bob Enter the Lottery with 1ETH each
        await enterLottery();
        await compiledContract.methods.pickWinner().send({
            from: accounts[0],
        });
    });

    it('Winner is Selected (Prize Pool sent to Winner)', async () => {
        const winner = await getWinner();
        assert( winner === 'bob' || winner === 'alice');
        const winner_address = await compiledContract.methods.getWinner().call();
        assert( winner_address === accounts[1] || winner_address === accounts[2]);
        console.log("\tThe winner is: ", winner);
    })

    it('The contract state is cleared after somebody wins', async () => {
        await getWinner();
        assert((await compiledContract.methods.getPlayers().call()).length == 0);
    })


    // ===== Helper Functions =======

    const enterLottery = async () => {
        let bob = accounts[1]
        let alice = accounts[2]
        // Save original balances
        let original_balance_bob = parseInt(await web3.eth.getBalance(bob));
        let original_balance_alice = parseInt(await web3.eth.getBalance(alice));
        // Constants defining how much alice & bob spend
        const bobETH = '1';
        const aliceETH = '1';
        // Alice & Bob Enter lottery with 1ETH each
        await compiledContract.methods.enter().send({ from:bob, value: web3.utils.toWei(bobETH, 'ether') });
        await compiledContract.methods.enter().send({ from:alice, value: web3.utils.toWei(aliceETH, 'ether') });
        // Check if balance reduced after sending money to lottery
        let redbal_bob = parseInt(await web3.eth.getBalance(bob));
        let redbal_alice = parseInt(await web3.eth.getBalance(alice));
        // Check if ETH has been deducted
        assert(original_balance_bob > redbal_bob)
        assert(original_balance_alice > redbal_alice)
        // Return Relevant data (Contract state is still present)
        return {
            bob_net_balance: redbal_bob,
            alice_net_balance: redbal_alice,
            eth_pledged: [bobETH, aliceETH],
        }
    }

    const getWinner = async () => {
        const res = await enterLottery();
        await compiledContract.methods.pickWinner().send({
            from: accounts[0],
        });
        let bob_balance = await web3.eth.getBalance(accounts[1]);
        let alice_balance = await web3.eth.getBalance(accounts[2]);

        let winner;

        if(bob_balance > res.bob_net_balance){
            winner = 'bob';
        }else if(alice_balance > res.alice_net_balance){
            winner = 'alice';
        }else{
            throw 'Unexpected Error: No Winner';
        }
        return winner;
    }
})