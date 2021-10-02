import Web3 from "web3";
let web3instance;

if(window.ethereum !== undefined){
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3instance = new Web3(window.ethereum);
}else{
    web3instance = undefined;
}

export default web3instance;