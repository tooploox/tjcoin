# About
Simple Blockchain implementaion using [TypeScript](https://www.typescriptlang.org).

# Usage
Run `npm test` to run unit tests.

# Hashing
SHA-256 hashing function from Nodes native `crypto` package. It is used for verifying transactions and blocks.

# Proof of Work algorithm
[Hashcash](https://en.wikipedia.org/wiki/Hashcash) was used as a Proof of Work algorithm.
The difficulty is determined by the number of characters searched for in a string.