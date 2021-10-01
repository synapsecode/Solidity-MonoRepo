const path = require('path');
const fs = require('fs');
const solc = require('solc')

const contractName = 'LotteryContract';

const contractPath = path.resolve(__dirname, 'contracts', contractName+'.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// console.log(solc.compile(source, 1)); //For Error Checking

compile_out = solc.compile(source, 1).contracts[':'+contractName];
// console.log(compile_out);

module.exports = compile_out;