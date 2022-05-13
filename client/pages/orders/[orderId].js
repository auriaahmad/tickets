import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const startPayment = async () =>{
  try{
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    const addr = "0x6e4DCCB8e5c75787eC0650ba152bd45Bf1597560";

    const ether = 0.1;
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress("0x6e4DCCB8e5c75787eC0650ba152bd45Bf1597560");
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(0.1)
    });
    console.log({ ether, addr });
    console.log("tx", tx);
  }catch(e){
    console.log(e.message);
  }
}

// which wallet we will support 

const provider_options ={
  walletconnect:{
    package:WalletConnectProvider,
    options:{
      infuraId:'f5cd5b57fb072cfd6761830d8df22e2c'
    }
  }
}

if (typeof window !== "undefined"){
  // web3 model object 
  const web3modal = new Web3Modal({
    network: 'ropsten',
    cacheProvider: true,
    providerOptions: provider_options,
  })
}

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KpW85F86bbY5u69jxpRDos8bjdnHihnuH9qoEieiHu6jngttHZaHUmkh4rUlPCeWUPoJslgeFSzcCGldjccdtnj00eRvzXH3Y"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      <button onClick={async ()=>{
        try{

          // startPayment();

          const provider = await web3modal.connect();
          const web3 = new Web3(provider);

          
          // console.log("we are here");
          // // web3.BatchRequest
          // console.log(
          //   web3.currentProvider
          // );
          
          // here we can get the public key of user
          
        }catch(e){
          console.log("we are here");
          // <h1>Please install your wallet</h1>
          console.log(e.messsage);
        }
          
      }}>Connect Wallet &rarr;</button>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
