pragma solidity ^0.4.17;

contract LotteryContract {
    // State Variables
    address public manager;
    address[] public players;

    // Constructor
    constructor() public {
        manager = msg.sender;
    }

    // Add Player
    function enter() public payable {
        // Check if paid value is exactly equal to how much required
        require(msg.value > 0.0001 ether, 'INSUFFICIENT FUNDS PLEDGED (MIN 0.0001 ETH)');
        players.push(msg.sender);
    }

    // Pick Winner
    function pickWinner() public managerOnly {
        uint idx = select_random_index();
        address winner = players[idx];
        // Transfer funds
        winner.transfer(address(this).balance);
        // Reset Players
        players = new address[](0); //Initial-Size=0
    }
    
    function select_random_index() private view returns (uint) {
        require(players.length != 0, 'NO PLAYERS!');
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % players.length;
    }

    function getPlayers() public view returns (address[]){ return players; }

    modifier managerOnly() {
        // Function can only be called by Manager
        require(msg.sender == manager, 'ONLY CONTRACT MANAGER CAN ACCESS THIS METHOD');
        _; //Target placeholder for compiler
    }
    
}