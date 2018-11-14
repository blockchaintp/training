## dont forget

 * open source the training repo
 * setup sextant users
 * https://docs.google.com/presentation/d/1NrSlU4K4ESckOu6fWtsvqLgPO2AUQKNlAATW5FR4nhU/edit#slide=id.p1
 
## run through

### day 1

09:30-10:00 Intros and Objectives
 
 * get everyone to say hello
 * get everyone to state what they want to learn (make notes)
 * make groups

10:00-10:30 Hyperledger Sawtooth Overview

 * talk through slides from talk

10:30-11:00 Hands-on: Setup Development Environment

 * workshops 1,2

11:00-11:30 Coffee

11:30-12:15 Hands-on: Tic-Tac-Toe Demo

 * workshops 3,4
 * play each other with GUI and CLI

12:15-13:00 Application Development Best Practices

 * merkle trees
 * addressing
 * blocks, batches, transactions
 * show the 'chain' as being state changes from blocks
 * transaction processors
   * tp api
   * state model
 * clients
   * signing transactions
     * what are the keys
   * verifying transaction


14:00-15:30 Hands-on: Tic-Tac-Toe Deep Dive

 * workshops 5,6,7,8,9
 * look at code for tp / client
 * refer back to Application Development Best Practices by picking bits of code
 * ideas for app:

   * fix play yourself
   * improve error messages (for example rather than it's not your turn - you are not in the game)
   * implement collaborative xo (only one move per key)
   * add a new transaction type to cheat game (like autowin) - an easter egg!!!
   * add a new transaction type to reset game
   * add a new transaction type to lock game
   * implement the storage as binary JSON
   * implement player log
   * implement leaderboard

16:00-17:30 Introduce Sextant & Demo Deploying to Production

 * make dockerhub account
 * build new image
 * push new image
 * spin up sextant cluster
 * deploy tp to cluster
 * play game using CLI

### day 2

09:30-10:00 Day 1 recap

 * development env
 * running tp in dev
 * xo gui / cli
 * `Application Development Best Practices` overview
 * recap what people did with xo deep dive
 * recap sextant

10:00-11:00 Hands-on: Develop Voting App #1

 * have bare bones and complete version of tp
 * have bare bones and complete version of cli
 * run tp locally in dev
 * connect client locally

11:30-13:00 Hands-on: Develop Voting App #2

 * continue dev
 * deploy to sextant

14:00-15:30 Hands-on: Seth Integration

 * run through commands
 * discussion / ideas

16:00-17:30 Running Sawtooth in Production

 * deep dive presentation about sextant and the various parts
 * show monitoring
 * kubernetes concepts




### transations / batches / batchlist

 * how the atomic unit is a batch
 * transactions can be mixed in a batch

## todo

 * process markdown into pages
   * copy/paste for code blocks
   * links to github
 * development environment
   * docker-compose stacks
     * node.js
 * xo demo
   * make it less opinionated for demo
   * track submitted transaction
   * skeleton for attendees to improve
     * tp with bug
     * skeleton client
 * deploying
   * settings tp for new tp version
 * basic voting app
   * tp
   * client
 * dockerhub setup instructions
 * sextant setup instructions
 * seth integration
 * protobufs setup

## cover

 * protobufs
 * state (merkle tree)
 * addressing
 * signing transactions
 * tp api
 * listening for events
 * network

### state management

 * simple binary encoded string (e.g. CSV)
 * BSON
 * ProtoBufs

### address management

 * prefix
 * choosing address based on action

### transations / batches / batchlist

 * how the atomic unit is a batch
 * transactions can be mixed in a batch


### before xo

 * useful CLI commands
 * keys inside of validator - `cat /root/.sawtooth/keys/my_key.priv`
 * location of rest-api - http://rest-api:8008

### start xo

Let's spin up a sawtooth stack that includes the xo-tp and xo-demo:

```bash
cd code/compose
docker-compose -f sawtooth.yaml -f xo.yaml up
```

This stack runs both:

 * an xo transaction processor
 * an xo demo ui

The xo transaction processor is not currently running but is available inside a node.js environment with a volume mounted to our host, i.e. the `code/xo-tp-javascript/src` folder is mounted into the container.

This means we can make changes to the code on our development machine and it will show up inside the container.  It also means we can restart the transaction processor easily in the (likely) case we make have any errors in our code.

This development container is hooked up to the same network as the validator meaning we can contact it using the `tcp://validator:4004` address.

This is a good way to rapidly iterate on locally developing a transaction processor - running a full sawtooth network on your laptop, changing code then restarting the validator process within the connected Docker container.

In another shell window, let's get ourselves into the xo-tp development container:

```bash
docker exec -ti sawtooth-xo-tp-javascript-default bash
```

Then let's actually start the transaction processor:

```bash
node src/index.js tcp://validator:4004
```

Notice in the validator logs - you should see that it recognized the transaction processor starting and registering by a line in the logs like this:

```bash
sawtooth-validator-default | [2018-11-13 09:11:49.896 INFO     processor_handlers] registered transaction processor: connection_id=fe4d3326797a1bc090e7000968880cc4123aaa5abfdf278a6af8a2964f3d1aecbd59926d5d2f93a296e5cd7f9b4b0037833017c5e958ba494cf360a3c14b607f, family=xo, version=1.0, namespaces=['5b7349']
```

The key parts being `registered transaction processor` and `family=xo, version=1.0, namespaces=['5b7349']`

### updating the settings

Before we can actually use our transaction processor - we will need to tell the settings tp that `xo` family transactions are allowed on the chain.

To do this - we the `sawset proposal create` tool inside the validator container.

This tool makes proposals to the settings tp which if accepted - will update the settings applied to the network.

Let's get ourselves into the validator container so we can run the `sawset` command:

```bash
docker exec -it sawtooth-validator-default bash
```

Now use the `sawtooth settings list` command to view the current settings recorded on the chain:

```bash
sawtooth settings list \
  --format json \
  --url http://rest-api:8008
```

This should produce output similar to:

```bash
{
  "head": "d81a4718cd588cf172081de949ed1c10f9d5f73bddaf70eb5d4370449161b1642a06b3467ffcc1449205c7e95ff58e6b75958e94de1187419977e921fe8d7dad",
  "settings": {
    "sawtooth.settings.vote.authorized_keys": "035b0be931427f254b02a799b7fcf336ad2b894a1a9ab2a224b87b52edbb20f704"
  }
}
```

We need to add the `sawtooth.validator.transaction_families` value which tells the validators what transaction processors are able to process transactions.

> The settings for a sawtooth network are saved on the blockchain.  In development mode - these proposals are accepted immediately.  In a production environment, you can configure the settings transaction processor to only accept new settings on a succesful vote.

Now we use the `sawset proposal create` command which will update the values of settings inside the settings tp.

The value we will update is:

```json
[{
  "family": "intkey", 
  "version": "1.0"
}, {
  "family":"sawtooth_settings", 
  "version":"1.0"
}, {
  "family":"xo", 
  "version":"1.0"
}]
```

As you can probably guess - this will active the following transaction processors:

 * intkey - used to test a sawtooth network
 * sawtooth_settings - used to save the settings on the chain (enabled)
 * xo - used for the xo game transaction processor

```bash
sawset proposal create \
  --url http://rest-api:8008 \
  --key /root/.sawtooth/keys/my_key.priv \
  sawtooth.validator.transaction_families='[{"family": "intkey", "version": "1.0"}, {"family":"sawtooth_settings", "version":"1.0"}, {"family":"xo", "version":"1.0"}]'
```

Now let's re-run our `sawtooth settings list` to confirm that setting is applied:

```bash
sawtooth settings list \
  --format json \
  --url http://rest-api:8008
```

This should produce output similar to:

```bash
{
  "head": "2d299a16af1307275422e920d38e01bc71a61e954daba2ee7ee5fd1315173cf1322fc50b8370d2fb71b43860c601c68abe9f00b6959e4cef5218484a8f7d46b4",
  "settings": {
    "sawtooth.settings.vote.authorized_keys": "035b0be931427f254b02a799b7fcf336ad2b894a1a9ab2a224b87b52edbb20f704",
    "sawtooth.validator.transaction_families": "[{\"family\": \"intkey\", \"version\": \"1.0\"}, {\"family\":\"sawtooth_settings\", \"version\":\"1.0\"}, {\"family\":\"xo\", \"version\":\"1.0\"}]"
  }
}
```




```bash
docker run -d \
  --name xo-demo \
  -p 8084:80 \
  --net sawtooth-dev \
  -e REST_API_HOSTNAME=rest-api \
  -e REST_API_PORT=8008 xo-demo
```

### start seth cli

```bash
docker run -ti --rm --net sawtooth-dev --entrypoint bash blockchaintp/sawtooth-seth-cli:1.0.5
```

```bash
seth init http://rest-api:8008
```

https://sawtooth.hyperledger.org/docs/seth/releases/latest/getting_started.html#creating-an-account


https://sawtooth.hyperledger.org/docs/seth/releases/latest/permissions.html


https://github.com/hyperledger/sawtooth-sdk-javascript

Run the seth CLI:

```
docker run -ti --rm --net sawtooth-dev --entrypoint bash blockchaintp/sawtooth-seth-cli:1.0.5
```

Run the seth RPC:

```

  #seth-rpc:
  #  image: blockchaintp/sawtooth-seth-rpc:1.0.5
  #  container_name: sawtooth-seth-rpc
  #  depends_on:
  #    - validator
  #  networks:
  #    - sawtooth-dev
  #  expose:
  #    - 3030
  #  ports:
  #    - "3030:3030"
  #  entrypoint: seth-rpc -vv --bind 0.0.0.0:3030 --connect tcp://validator:4004 --process tcp://0.0.0.0:4005
```

mount `~/.sawtooth/keys` to keep all the files


```
    1  seth init http://rest-api:8008
    2  openssl ecparam -genkey -name secp256k1 | openssl ec -out key-file.pem -aes128
    3  ls -la
    4  cat key-file.pem
    5  seth account import key-file.pem binocarlos
    6  seth account create --nonce=0 --wait binocarlos
    7  seth show account 51d85ea883a51fce4428970960f158e72fea88f1
    8  solc
    9  vi
   10  apt-get update
   11  nano
   12  apt-get update
   13  cat > contract.sol
   14  cat contract.sol
   15  solc --bin contract.sol
   16  #seth contract create --wait binocarlos
   17  ls -la
   18  #seth contract create --wait binocarlos --help
   19  seth contract create --wait binocarlos --help
   20  seth contract create --wait binocarlos 608060405234801561001057600080fd5b50610239806100206000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631ab06ee514610067578063812600df1461009e5780639507d39a146100cb578063c20efb901461010c575b600080fd5b34801561007357600080fd5b5061009c6004803603810190808035906020019092919080359060200190929190505050610139565b005b3480156100aa57600080fd5b506100c960048036038101908080359060200190929190505050610193565b005b3480156100d757600080fd5b506100f6600480360381019080803590602001909291905050506101c2565b6040518082815260200191505060405180910390f35b34801561011857600080fd5b50610137600480360381019080803590602001909291905050506101de565b005b80600080848152602001908152602001600020819055507f545b620a3000f6303b158b321f06b4e95e28a27d70aecac8c6bdac4f48a9f6b38282604051808381526020018281526020019250505060405180910390a15050565b600160008083815260200190815260200160002054016000808381526020019081526020016000208190555050565b6000806000838152602001908152602001600020549050919050565b6001600080838152602001908152602001600020540360008083815260200190815260200160002081905550505600a165627a7a723058205ab962e51ffee3e3271617dede2567dcfddba0337b30d186102c2402ebdab5070029
   21  seth show account 92768855faf62cb2262a8d992f0f39fbb8678d37
   22  node
   23  seth contract call --wait binocarlos 92768855faf62cb2262a8d992f0f39fbb8678d37 1ab06ee50000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000002a
   24  seth show receipt 8c20337bd6085da61b0758fb45facba15ac54399387d8a54c1097b20ca4fc2413904ccf94ca26bc610e740e34c4aa7e5c6b51ea9354bf75a49b2879a8359e262
   25  history
```


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


## example schedule

## Day 1

09:30-10:00 Intros and Objectives

10:00-10:30 Hyperledger Sawtooth Overview

We introduce the basic concepts - this is an "explore the map" overview of the various moving parts.

10:30-11:00 Hands-on: Setup Development Environment

We help folks to get setup with their development environment

 * install docker & docker-compose
 * run local sawtooth
 * make code changes and reload
   * we will use the JS xo implementation in a folder in this repo
 * have a nice exercise for people who get this done in 5 mins to pass the time
 * get ip addresses of each person and write them on the board
 * create a dockerhub or quay.io account

11:00-11:30 Coffee

11:30-12:15 Hands-on: Tic-Tac-Toe Demo

 * get folks to play xo with each other 
 * we will have our XO gui running as part of the container
 * get them to use the GUI to play games against each other
 * get them to use the CLI tool to look at games and make moves

12:15-13:00 Application Development Best Practices

Use XO Transaction Family reference implementation to highlight the key considerations that need to be taken into when developing a new transaction family

13:00-14:00 Lunch

14:00-15:30 Hands-on: Tic-Tac-Toe Deep Dive

 * Edit code in the tp
   * fix the bug where you can play yourself
 * Implement your own client
   * provide a skeleton client that they finish off
 * Deploy the new tp code with new version
   * update the settings to account for the tp version
 * Push the new code to dockerhub

15:30-16:00 Coffee

16:00-17:30 Introduce Sextant & Demo Deploying to Production

 * create a cluster & sawtooth network
 * deploy the xo-tp 1.1 image they just pushed to production
 * update the settings to allow for xo-tp 1.1


## Day 2

09:30-10:00 Day 1 Recap

10:00-11:00 Hands-on: Develop Voting App #1

Extended session where we provide skeletal code for a voting application derived from the settings-tp which will use & reinforce everything learned Day 1

11:00-11:30 Coffee

11:30-13:00 Hands-on: Develop Voting App #2

13:00-14:00 Lunch

14:00-15:30 Hands-on: Seth Integration

Show how standard Ethereum developer tools such as truffle and remix can be used with a Sawtooth network where seth-tp is deployed thus opening up the world of Solidity/Ethereum. Also highlight recent work supporting WASM.

15:30-16:00 Coffee

16:00-17:30 Running Sawtooth in Production

Best practices & benefits of Sextant over DIY approach



## booting development stack

```
cd sawtooth-core/docker/compose
git checkout btp-releases/1.0.5
docker-compose -f sawtooth-default-go.yaml up
```

Then we want to enable the xo tp:

```
docker exec -it sawtooth-validator-default sawset proposal create \
  --url http://rest-api:8008 \
  --key /root/.sawtooth/keys/my_key.priv \
  sawtooth.validator.transaction_families='[{"family": "intkey", "version": "1.0"}, {"family":"sawtooth_settings", "version":"1.0"}, {"family":"xo", "version":"1.0"}]'
docker exec -it sawtooth-validator-default sawtooth settings list --url http://rest-api:8008
```

List games:

```
docker exec -ti sawtooth-shell-default xo list --url http://rest-api:8008
```

List games curl:

```
docker exec -ti sawtooth-shell-default curl http://rest-api:8008/state?address=5b7349
```

## state

 * [merkle hashes](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/global_state.html#merkle-hashes)
 * [radix addresses](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/global_state.html#radix-addresses)

## architecture

 * [transactions and batches](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/transactions_and_batches.html#transactions-and-batches)
 * [transaction data structure](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/transactions_and_batches.html#transaction-data-structure)
 * [journal](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#journal)
 * [blockstore](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-blockstore)
 * [blockcache](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-blockcache)
 * [completer](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-completer)
 * [consensus](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-consensus-interface)
 * [chain controller](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-chaincontroller)
 * [block publisher](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/journal.html#the-blockpublisher)
 * [genesis operation](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/journal.html#genesis-operation)
 * [transaction scheduling](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/scheduling.html#transaction-scheduling)
 * [rest api](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/rest_api.html#rest-api)
 

## general

 * [SGX](https://en.wikipedia.org/wiki/Software_Guard_Extensions)
 * [poet](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/poet.html#poet-1-0-specification)
 * [cli commands](https://sawtooth.hyperledger.org/docs/core/releases/1.0/cli.html)

## application best practices notes

 * [data structures must always enforce ordered serialization](https://sawtooth.hyperledger.org/docs/core/releases/latest/architecture/global_state.html#serialization-concerns)


## tp specs

 * [overview](https://sawtooth.hyperledger.org/docs/core/releases/1.0/transaction_family_specifications.html#transaction-family-specifications)


## core concepts


### application components

To write any kind of application you need to consider:

 * state serialization
   * how is the state going to be serialized on the chain

 * addressing - how the state addresses will be formed based on the key for your state entry
   * prepend with tp namespace
   * rest of address is dot delimeted nodes based on what the key represents

 * having a transaction submission wrapper
   * any interaction with your TP that modifies state will need to create a transaction
   * this will be the same work apart from:
     * addresses
     * payload
   * you would have some kind of client wrapper for these calls


### creating a transaction

 * create the payload bytes
 * formulate the address for the state object being modified
 * create a new header with:
   * signer_public_key
   * family_name, family_version
   * inputs, outputs, dependencies (which addresses are used - this informs the scheduler)
   * payload_sha512
   * batcher_public_key
   * nonce
 * create a transaction header signature
 * create the transaction with
   * header
   * payload
   * header_signature
 * create a new batch header with
   * signer_public_key
   * transaction_ids -> header_signature from transactions
 * create a batch header signature
 * create a batch with
   * header
   * transactions
   * header_signature
 * serialize the batch list
 * POST http://hostname/batches

### reading state

```
curl http://rest-api:8008/state?address=5b7349
```

Where `5b7349` is the prefix for the tp

You can have any amount of bytes in the address and it will show all state below that prefix

## really useful commands

#### list transactions

```
sawtooth transaction list --url http://rest-api:8008
```

#### view state

```
sawtooth state list --format csv --url http://rest-api:8008
```

## commands

#### curl blocks

```
curl http://localhost:8008/blocks
```

#### login to the shell container

```
docker exec -ti sawtooth-shell-default bash
```

#### create a intkey batch

```
intkey create_batch --count 10 --key-count 5
```

#### submit the batch

```
sawtooth batch submit -f batches.intkey --url http://rest-api:8008
```

#### list the blocks

```
sawtooth block list --url http://rest-api:8008
```

#### view single block

```
sawtooth block show --url http://rest-api:8008 {BLOCK_ID}
```

#### list nodes in merkle tree

```
sawtooth state list --url http://rest-api:8008
```

#### view state at merkle tree address

```
sawtooth state show --url http://rest-api:8008 {STATE_ADDRESS}
```

#### list settings

```
sawtooth settings list --url http://rest-api:8008
```

#### activate transaction families

```
docker exec -it sawtooth-validator-default bash
sawset proposal create \
  --url http://rest-api:8008 \
  --key /root/.sawtooth/keys/my_key.priv \
  sawtooth.validator.transaction_families='[{"family": "intkey", "version": "1.0"}, {"family":"sawtooth_settings", "version":"1.0"}, {"family":"xo", "version":"1.0"}]'
sawtooth settings list --url http://rest-api:8008
```

## tricks

### docker image for python env

```
docker build -t python -f dockerfiles.dockerfile
docker run -ti --rm python bash
python3
```

### basic python repl to calcualte hashes

```
docker run --rm -ti ubuntu:bionic bash
apt-get update
apt-get install -y python
python
>>> import hashlib
>>> hashlib.sha512('intkey'.encode('utf-8')).hexdigest()[0:6]
```

### manual signing of transaction

#### environment

```
docker run --rm -ti ubuntu:bionic bash
apt-get update -y
apt-get install -y python3 python3-pip pkg-config autoconf libtool
pip3 install secp256k1 cbor
python3
```

#### create keys

```
import secp256k1
key_handler = secp256k1.PrivateKey()
private_key_bytes = key_handler.private_key
public_key_bytes = key_handler.pubkey.serialize()
public_key_hex = public_key_bytes.hex()
```

#### create payload

```
import cbor
payload = {
    'Verb': 'set',
    'Name': 'foo',
    'Value': 42}
payload_bytes = cbor.dumps(payload)
from hashlib import sha512
payload_sha512 = sha512(payload_bytes).hexdigest()
```

#### create transaction header

```
from random import randint
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader

txn_header = TransactionHeader(
    batcher_public_key=public_key_hex,
    # If we had any dependencies, this is what it might look like:
    # dependencies=['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    family_name='intkey',
    family_version='1.0',
    inputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    nonce=str(randint(0, 1000000000)),
    outputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    payload_sha512=payload_sha512,
    signer_public_key=public_key_hex)

txn_header_bytes = txn_header.SerializeToString()
```

### sign header

```
key_handler = secp256k1.PrivateKey(private_key_bytes)

# ecdsa_sign automatically generates a SHA-256 hash of the header bytes
txn_signature = key_handler.ecdsa_sign(txn_header_bytes)
txn_signature_bytes = key_handler.ecdsa_serialize_compact(txn_signature)
txn_signature_hex = txn_signature_bytes.hex()
```

### create transaction

```
from sawtooth_sdk.protobuf.transaction_pb2 import Transaction

txn = Transaction(
    header=txn_header_bytes,
    header_signature=txn_signature_hex,
    payload=payload_bytes)
```

### create batch header

```
from sawtooth_sdk.protobuf.batch_pb2 import BatchHeader

batch_header = BatchHeader(
    signer_public_key=public_key_hex,
    transaction_ids=[txn.header_signature])

batch_header_bytes = batch_header.SerializeToString()
```

### sign batch header

```
batch_signature = key_handler.ecdsa_sign(batch_header_bytes)

batch_signature_bytes = key_handler.ecdsa_serialize_compact(batch_signature)

batch_signature_hex = batch_signature_bytes.hex()
```

### create batch

```
from sawtooth_sdk.protobuf.batch_pb2 import Batch

batch = Batch(
    header=batch_header_bytes,
    header_signature=batch_signature_hex,
    transactions=[txn])

```

### encode batch

```
from sawtooth_sdk.protobuf.batch_pb2 import BatchList

batch_list = BatchList(batches=[batch])
batch_bytes = batch_list.SerializeToString()
```

### submit batch

```
import urllib.request
from urllib.error import HTTPError

try:
    request = urllib.request.Request(
        'http://rest.api.domain/batches',
        batch_list_bytes,
        method='POST',
        headers={'Content-Type': 'application/octet-stream'})
    response = urllib.request.urlopen(request)

except HTTPError as e:
    response = e.file

```

