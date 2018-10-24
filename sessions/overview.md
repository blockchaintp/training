## Hyperledger Sawtooth Overview

 * blockchain basics
   * immutable ledger
   * peer to peer networking
   * transactions mutating state
   * ...

 * sawtooth
   * explore the map
     * validator
     * transaction processors
     * transaction families
     * rest-api
     * zeroMQ network between validators
     * ...
   * transactions
     * header
     * payload hash
     * payload
     * input/output & depedency addresses
     * nonce
     * signer
   * batches
     * explain it's atomic
     * there can be >1 transaction in a batch
