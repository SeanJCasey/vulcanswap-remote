require('dotenv').config();

const Web3 = require('web3');
const contractABI = require('./CostAverageOrderBookABI-v0.1.json');

const provider = process.env.PROVIDER;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
const address = account.address;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// A. Execute in bulk
// contract.methods.executeDueConversions().estimateGas({ from: address })
//     .then(gasEstimated => contract.methods.executeDueConversions().send({ from: account.address, gas: gasEstimated+10000 }))
//     .catch(err => console.log(err));

// B. Execute after querying for all due conversions.
contract.methods.checkConversionDueAll().call({ from: address })
  .then(conversionDueMap => executeDueConversionsFromMapping(conversionDueMap))
  .catch(err => console.log(err));

// C. Execute after querying for due conversions in batches.
// contract.methods.checkConversionDueBatch(1, 5).call()
//     .then(conversionDueMap => executeDueConversionsFromMapping(conversionDueMap))
//     .catch(err => console.log(err));

const executeDueConversionsFromMapping = conversionDueMap => {
  let txCount;
  web3.eth.getTransactionCount(address)
    .then(res => txCount = res)
    .then(() => {
      conversionDueMap.filter(Number).forEach(orderId => {
        // Create and sign raw tx
        const tx = {
          to: contractAddress,
          gas: 200000,
          data: contract.methods.executeDueConversion(orderId).encodeABI(),
          nonce: txCount,
        };
        account.signTransaction(tx)
          .then(signed => web3.eth.sendSignedTransaction(signed.rawTransaction))
          .then(() => console.log('executed orderId:', orderId))
          .catch(err => console.log('ERROR orderId:', err));

        // Increment nonce
        txCount++;
      })
    })
    .catch(err => console.log(err));
    // contract.methods.executeDueConversion(orderId).estimateGas({ from: address })
    //   .then(gasEstimated => {
    //     console.log('running');
    //     contract.methods.executeDueConversion(orderId).send(
    //       { from: address, gas: gasEstimated+10000 })
    //   })
    //   .catch(err => console.log(err));
}
