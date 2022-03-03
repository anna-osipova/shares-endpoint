# Claim free share endpoint

- To run: `docker-compose up app`
- To run tests: `docker-compose up test`

## Assumptions

`Broker.getRewardsAccountPositions` API looks like it should return an array of tradable assets. However, according to docs it returns one asset. If it indeed supposed to return just one asset, we can omit checking rewards account positions for available assets and always query tradable assets straight away.

Since there can be multiple tradable assets within a reward range, we will be choosing a random one.

User's account id would come from the session, it is hardcoded for now.

If the market is closed, we show user a message instruction when to return.

Implementing a CPA is not feasible with the requirement of being precise with a small number of users such as 100. It would be possible by storing a state of previously administered shares and adjusting subsequent shares accordingly. However that would require a DB and I will scope it out of this MVP implementation.  

## Fractional shares

With fractional shares we no longer need to choose a share price within a range, but we can choose any desired share value randomly and adjust fractions accordingly.

1. We would no longer need to query all tradable asset prices: it is enough to choose one asset, query its price and award number of shares accordingly (if we do not want to award more than one share, we need to choose a share with a value higher than the target reward price).
2. We need to modify the range randomization so that it returns a target price instead of a range.
3. We can reduce the number of operations with the broker API by buying multiple shares of the same company and awarding fractions of those shares (all users get the same company).
4. We should tell user both the fraction and the value of their awarded share.