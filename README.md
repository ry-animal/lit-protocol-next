# lit-protocol-next

## Goal

1. Leveraging Lit Protocol, NextJs/React to build a mini-full-stack application
   1. Can use any styling libraries, Tailwind is preferred

## Measurement

1. How fast you can pick up and leverage new tech (Lit) that is not necessarily the best documented
2. Code style/structure/maintainability

//Not particularly concerned on nitty, gritty styling etc, so you don’t need to spend too much time there. Functionality is much more important. Definitely feel free to use a library like ShadCN.

## Task

1. Run through and get familiar with Lit Documentation and how Lit Protocol works. Ask any and all questions - questions are super encouraged, Lit Docs are still a WIP so know it can be a bit all over the place. If you have trouble finding anything within Lit, highly recommend just pinging me in TG since will be able to point you to the right resources since their docs are quite scattered!!
2. Your goal is to write a bare bones single chain limit order dApp leveraging Lit Protocol, Uniswap on Ethereum Sepolia
   1. The dApp should
      1. Create a Lit PKP / Ethereum Wallet tied to a Google Account
      2. Create a Session with that PKP
      3. Encrypt a Limit Order with the created PKP (can save the encrypted data in Local Storage)
      4. Execute the Limit Order within a Lit Action
         1. For getting the calldata use Uniswap, but ideally do not use the SDK and directly interact with the contracts
         2. You do not need to set up a timechron or websocket to listen to price changes to fire the Lit Action, it can just be a button that runs the Lit Action Limit Order
            1. The Limit Order should check the price from defined or via the SDK and make sure it satisfies the price conditions
3. Implement the above within a NextJs project,
4. You can feel free to define your data types, UI, etc. any way you like (to keep things simple you can base all limit orders on ETH / WETH pairs.
5. No need to set up a DB, can just save everything in localstorage for the scope of the demo
6. Aim to finish in no more than 2 days. (Candidly this may be a lot larger scope than 2 days, so if you’re not all the way through - just send in what you have and can walk through the code together)

Helpful Utilities

https://www.alchemy.com/faucets/ethereum-sepolia - getting sepolia eth (we can also send you some if you need it)

https://usehooks-ts.com/ — localstorage hooks

https://ui.shadcn.com/ - ui components

https://tailwindcss.com/docs/installation - tailwind

https://docs.defined.fi/reference/getnetworks — pricing api for ethereum sepolia + tokens etc.

## Solidity Notes

[Solidity Section](#solidity-notes)

- [Q1](#q1)
- [Q2](#q2)
- [Q3](#q3)

## Q1

desc:

- \_isBalanceWithinThreshold(uint256 balance):
  check if balance is within the threshold limit and calculate a lower bound based on totalStakedAssets and rebalanceThreshold. Returns true if the balance >= lower bound.

- \_updateBalance():
  updates the totalAssets of the contract by fetching the balance of the stablecoin for the contract's address.

- \_updateStakedBalance(uint256 amount, uint256 add):
  updates the totalStakedAssets and if add is 1 adds the amount to totalStakedAssets else it subtracts the amount.

- \_updateAvailableAssets():
  updates the availableAssets and minAssetBalance based on the current totalAssets, totalStakedAssets, and rebalanceThreshold then calculates liquidity and updates availableAssets

order:

- \_updateBalance() : updated for new deposits
- \_updateStakedBalance(amount, 1) : increase new staked amt
- \_updateAvailableAssets() : recalculated based on total and staked balances

## Q2

potential attack:

- needs permission to call aggregate()
- The contract should not have proper access controls or validation on the targets and data parameters.

attack scenario:

- attacker could use this function to call other contract address
  - calling sensitive functions on other contracts
  - xfer assets from the contract to the attacker's address

funds at risk:

- eth in the contract
- assets that contract has permission to interact with

risk mitigation:

- access controls
- whitelist of allowed target addresses

## Q3

### Permit2

pros:

- gasless sigs for every token
- expiration date
- batching approvals and xfers in one tx
- can be used for multiple tokens allowance
- better ux experience

cons:

- not backwards compatible
- not all wallets support it
- not all contracts support it
- since it can approval multiple tokens, it can be a security risk
- unlimited approval (pro or con)
- centralized contract risk for Permit2
