const path = require('path');
const fs = require('fs');
const solc = require('solc')

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
const source = fs.readFileSync(inboxPath, 'utf8');

compile_out = solc.compile(source, 1).contracts[':Inbox'];
// console.log(compile_out);

module.exports = compile_out;