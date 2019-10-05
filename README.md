# Vulcan Swap -- Remote Caller

This is the repo containing Vulcan Swap's "remote caller" Node.js function that queues Vulcan Swap orders for execution.

This is the script deployed on AWS (you would also need to configure an AWS CloudWatch event if you want to run this function at a scheduled time interval).

You have two installation options...

## Deploy all of Vulcan Swap locally

Follow the instructions in the `vulcanswap-truffle` repo for the full setup pipeline: https://github.com/SeanJCasey/vulcanswap-truffle

## Deploy only the remote caller function (locally)

### 1. Clone this repo and install dependencies
`git clone git@github.com:SeanJCasey/vulcanswap-remote.git && cd vulcanswap-remote && npm i`

### 2. Create a `.env` file and add environment variables for:

```
PRIVATE_KEY=
CONTRACT_ADDRESS=
PROVIDER=
```

`PRIVATE_KEY` is an Ethereum account private key (it must have some ETH to execute the `executeDueConversion(orderId)` method)

`CONTRACT_ADDRESS` is the `CostAverageOrderBook` contract address deployed on whichever network you want to interact with it.

`PROVIDER` is an Ethereum Provider, generally Infura. You can easily set up an account and create a provider at https://infura.io.

### 3. Run the script to check for due orders and execute them as needed

`node script`
