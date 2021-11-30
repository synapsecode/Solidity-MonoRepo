const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { cornsilk } = require('color-name');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    //Creating a new Contract
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0], 
        gas: '1000000'
    });
    
    //ES2016 Array Destructuring
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    //Making a reference to an already created contract
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', ()=>{
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it('marks caller as manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('allows contributions and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1],
        })
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    })

    it('requires a minimum contribution', async () => {
        try{
            //Should throw error as minimum amount is 100 wei
            await campaign.methods.contribute().send({
                value: '20',
                from: accounts[1],
            })
            assert(false);
        }catch(e){
            assert(e);
        }
        
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('Buy Batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call(); 
        assert.equal('Buy Batteries', request.description);   
    })

    it('processes requests', async () => {

        let og_balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accounts[1])));
        

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accounts[1])));
        assert(balance > og_balance)
    })
})