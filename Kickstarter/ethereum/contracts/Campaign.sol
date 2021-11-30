pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] deployedContracts;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); //Creates a new Contract
        deployedContracts.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedContracts;
    }
}


contract Campaign{
    struct Request{
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution = 150 wei;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    constructor(uint mincontribution, address creator) public {
        manager = creator;
        minimumContribution = mincontribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string desc, uint val, address rec) public restricted {
        Request memory newRequest = Request({
            description: desc,
            value: val,
            recepient: rec,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender];
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);

        request.recepient.transfer(request.value);
        request.complete = true;
    }

     modifier restricted() {
        // Function can only be called by Manager
        require(msg.sender == manager, 'RESTRICTED METHOD');
        _; //Target placeholder for compiler
    }
}

/*
Mapping - Basically a hash table
-> A Solidity mapping does not store the keys,
-> A Mapping is not iterable
-> All Values exist (type specific default value will be returned)
-> Mappings and other reference types need not be initialized in a struct


New Concept - Factory Contracts
-> A Contract can deploy another contract - Safe & The gas cost falls on the user



npm install ganache-cli mocha solc@0.4.26 fs-extra web3
npm install @truffle/hdwallet-provider
*/
