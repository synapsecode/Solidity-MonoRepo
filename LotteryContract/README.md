# LotteryContract Project

Get Test Rinkeby Ether from this [Faucet](https://www.rinkeby.io/#faucet)

This is my second Ethereum Smart Contract and is a slightly more advanced project than the Inbox Contract Project. This project is a part of the Ethereum and Solidity: The Complete Developer's Guide course on Udemy that I had purchased a few years back but never finished! Although i pretty much wrote most of this on my own + little help from Stack Overflow

## About this Project
The Lottery Contract is a basic project where people who submit greater than a certain amount of ether are recorded as players of the contract. When the manager calls the pickWinner function, it uses a pseudorandom number generator to select a player who is the winner! The entire prize pool is sent to this winner and the contract is ready for use again!

## Learnings from this Project:
- Create and Perform operations on arrays in solidity
- Use access modifiers in solidity (pure, public, private, view etc)
- Learnt about the msg global variable
- Learnt about payable functions and how to recieve ether sent to the contract
- Learnt how to send eth to an address in solidity
- Learnt how to make a pseudorandom number generator in solidity using keccak256
- Learnt how to make custom modifiers
- Learnt to write better Mocha Tests on my own
- Learnt how to send transactions to a func using send({..})
- Learnt how to check balance of account, contract in mocha
- Learnt how to write tests that check if something fails (Try-Catch-Assert syntax)
- Learnt that we can add help messages to require statements in solidity for easy debugging
- ReactJS Stuff


## Problems with this project:
- Could not deploy it to Rinkeby using Infura (Either it claims issues with gasPrice or takes too long to do anything while consuming infura request quota)


## FrontEnd Created using ReactJS