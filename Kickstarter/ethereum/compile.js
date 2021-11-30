const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//Delete the entire build folder if already exists
console.log('Removing Existing build..')
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//Read Contract
console.log('Compiling Solidity Contract...')
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf-8')
const output = solc.compile(source,1).contracts

//Recreate build folder
fs.ensureDirSync(buildPath)

for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract],
    )
}
console.log('Compilation Complete!')