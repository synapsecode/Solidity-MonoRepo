import './App.css';
import web3 from './web3';

import React, { useState } from 'react';
import lottery from './lottery';

function App() {

  const [manager, setManager] = useState();
  const [players, setPlayers] = useState();
  const [balance, setBalance] = useState();
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');

  const refreshData = async () => {
    setManager(await lottery.methods.manager().call());
    setPlayers(await lottery.methods.getPlayers().call());
    setBalance(web3.utils.fromWei(await web3.eth.getBalance(lottery.options.address), 'ether'));
  }

  React.useEffect(() => {
    (async () => {
      await refreshData();
    })();
  }, []);

  const handleTXError = async (promise, callback) => {
    try {
      await promise;
      callback();
    } catch (e) {
      console.log(e);
      if (e.code !== undefined && e.message !== undefined) {
        setMessage(`Error (${e.code}): ${e.message}`);
        setTimeout(() => setMessage(''), 8000)
      } else {
        setMessage(`Unexpected Error: Please check Console`);
      }
    }
  }

  const onSumbit = async (e) => {
    e.preventDefault();
    setMessage('Waiting for Transaction Completion....');
    const accounts = await web3.eth.getAccounts();
    handleTXError(
      lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether'),
      }), () => {
        refreshData();
        setMessage('You have successfully entered the Lottery!')
        setTimeout(() => setMessage(''), 4000)
      }
    );
  }

  const pickWinner = async (e) => {
    e.preventDefault();
    let winner_addr;
    const accounts = await web3.eth.getAccounts();
    const contract_manager = await lottery.methods.manager().call()
    if (contract_manager === accounts[0]) {
      setMessage('Picking Winner...');
      try {
        await lottery.methods.pickWinner().send({
          from: accounts[0],
        });
        winner_addr = await lottery.methods.getWinner().call();
        setMessage('Winner: ' + winner_addr)
      } catch (e) { console.log(e); }
    } else {
      alert('Only Managers can Pick Winners!')
    }
  }


  if (web3 === undefined) {
    return <h1>INSTALL METAMASK BRO</h1>
  } else {
    return (
      <div className="App">
        <header className="App-header">
          {
            (message !== '') ? <h1> {message} </h1> :
              <div>
                <h1>Lottery Contract! 🔰</h1>
                <h5>Manager Address: {manager === undefined ? 'Undefined' : <span class='redtext'>{manager}</span>}</h5>
                <p>There are currently {<span class='goldtext'>{players?.length}</span>} players who are competing to win {<span class='greentext'>{balance} ETH!</span>}</p>
                <form>
                  <div>
                    <label>Amount pledged by you: ({<span class='greentext'>{amount} ETH</span>}): </label><br />
                    <input value={amount} type="text" onChange={e => setAmount(e.target.value)} />
                  </div>
                  <button onClick={onSumbit}>Enter</button>

                  <br />
                  <br />
                  <br />
                  <button class="pickwinner" onClick={pickWinner}>Pick Winner</button>

                </form>
              </div>
          }
        </header>
      </div>

    );
  }

}

export default App;
