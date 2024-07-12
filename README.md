# lit-protocol-next

## Genius Interview - Mini Project

At our core, looking for someone who takes pride in their ideas and defends them, a critical thinker to shape architecture, design, and product decisions, and loves to ship code, move fast, and hustle with the team!

## Goal

1. Leveraging Lit Protocol, NextJs/React to build a mini-full-stack application
   1. Can use any styling libraries, Tailwind is preferred
2. Your questions/thoughts/concerns on the current Genius Architecture + understanding of Solidity

## Measurement

1. How fast you can pick up and leverage new tech (Lit) that is not necessarily the best documented
2. Code style/structure/maintainability
3. Thought process + architect a project with a many moving pieces
4. Critical thought on Genius’ current architecture / general understanding of Solidity

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
7. You will be compensated $300 for the task.

Helpful Utilities

https://www.alchemy.com/faucets/ethereum-sepolia - getting sepolia eth (we can also send you some if you need it)

https://usehooks-ts.com/ — localstorage hooks

https://ui.shadcn.com/ - ui components

https://tailwindcss.com/docs/installation - tailwind

https://docs.defined.fi/reference/getnetworks — pricing api for ethereum sepolia + tokens etc. (lmk if you need an api key)

## Solidity Notes

[Solidity Section](#solidity-notes)

- [Q1](#q1)
- [Q2](#q2)
- [Q3](#q3)

## Q1

\_isBalanceWithinThreshold(uint256 balance):
Check if a given balance is within the threshold limit and it calculates a lower bound based on totalStakedAssets and rebalanceThreshold. Returns true if the balance >= lower bound.

\_updateBalance():
Updates the totalAssets of the contract by fetching the balance of the stablecoin for the contract's address.

\_updateStakedBalance(uint256 amount, uint256 add):
Updates the totalStakedAssets and if add is 1 adds the amount to totalStakedAssets else it subtracts the amount.

\_updateAvailableAssets():
Updates the availableAssets and minAssetBalance based on the current totalAssets, totalStakedAssets, and rebalanceThreshold then calculates liquidity and updates availableAssets

Order -
\_updateBalance() : updated for new deposits
\_updateStakedBalance(amount, 1) : increase new staked amt
\_updateAvailableAssets() : recalculated based on total and staked balances

## Q2

Conditions for a potential attack:

- The attacker needs to have permission to call the aggregate() function.
- The contract should not have proper access controls or validation on the targets and data parameters.

Potential attack scenario:
An attacker could use this function to execute arbitrary calls to any contract address, potentially including:

- Calling sensitive functions on other contracts.
- Transferring tokens or ETH from the contract to the attacker's address.
- Manipulating state variables in other contracts.
- Performing flash loan attacks by batching multiple operations.

Types of funds at risk:

- Any ETH stored in the contract.
- Any ERC20 tokens that the contract has approval to spend.
- Any assets controlled by contracts that this contract has permission to interact with.

To mitigate these risks, it's crucial to implement strict access controls, validate target addresses,
and carefully review the data being passed to this function.
Additionally, using a whitelist of allowed target addresses and function signatures could significantly reduce
the attack surface.

## Q3

Permit2, developed by Uniswap, offers several improvements over traditional ERC20 allowances. Let's break down its features, benefits, and potential risks:

Differences from normal ERC20 allowances:

1. Signature-based approvals: Permit2 uses EIP-712 signatures for approvals, allowing users to grant permissions without an on-chain transaction.

2. Time-bound permissions: Approvals can have expiration times, limiting the window of vulnerability.

3. Allowance management: Users can set specific allowance amounts for different spenders and tokens in a single operation.

4. Batched operations: Permit2 enables combining multiple token approvals and transfers in a single transaction.

Usefulness in multi-step transactions:

1. Gas efficiency: By batching operations, it reduces the number of separate transactions needed for complex operations.

2. Improved UX: Users can approve and execute multi-step operations in a single transaction, streamlining the process.

3. Flexibility: It allows for more complex and customized token interaction patterns without multiple approval steps.

Why Permit2 is "safer" than regular allowances:

1. Time-limited approvals: Reduces the risk window compared to indefinite traditional allowances.

2. Granular control: Users can set specific allowances for different spenders and tokens, minimizing exposure.

3. No need for "infinite" approvals: Users don't need to set unnecessarily high allowances for protocols to function.

4. Signature-based: Approvals can be granted off-chain, reducing on-chain footprint and potential attack surface.

Potential risks with Permit2:

1. Signature reuse: If signatures are not properly invalidated after use, they could potentially be reused.

2. Phishing attacks: Users might be tricked into signing malicious permissions.

3. Smart contract vulnerabilities: As with any smart contract, undiscovered bugs could lead to exploits.

4. Centralization risk: Reliance on a single contract (Permit2) could create a central point of failure if compromised.

5. User error: Complex permissions might confuse users, leading to unintended approvals.

6. Front-running: In some scenarios, signed permissions could be front-run before their intended use.

While Permit2 offers significant improvements in safety and flexibility over traditional ERC20 allowances, users and developers should remain vigilant and understand the system thoroughly to mitigate potential risks.
