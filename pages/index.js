import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const transfer = async() => {
    if (atm) {
      if (typeof atm.transfer === 'function') {
        let tx = await atm.transfer(1);
        await tx.wait();
        getBalance();
      } else {
        console.log("Transfer function is not available in the ATM contract");
      }
    }
  }

  const returnAddress = async () => {
    if (atm) {
      if (typeof atm.returnAddress === 'function') {
        let tx = await atm.returnAddress();
        await tx.wait();
        getBalance();
      } else {
        console.log("returnAddress function is not available in the ATM contract");
      }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Hey user Connect your MetaMask Wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Balance: {balance}</p>
        <button onClick={deposit}>Increase 1 ETH</button>
        <br></br>
        <br></br>
        <button onClick={withdraw}>Decrease 1 ETH</button><br></br><br></br>
        <button onClick={transfer}>Transfer Funds</button><br></br><br></br>
        <button onClick={returnAddress}>Owner Address</button> 
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
  <header>
    <h1>Welcome to Anurag Kaushik's ATM!</h1>
  </header>
  {initUser()}
  <style jsx>{`
    .container {
      height: 100%;
      width: 100%;
      text-align: center;
      background-color: #fdf0d5; 
      padding: 90px 35px;
    }
    h1 {
      color: #003049; 
      font-size: 24px;
      margin-bottom: 20px; 
    }
  `}
  </style>
</main>
  )
}
