---
title: Development Environment
order: 2
---

Now we are going to spin up a sawtooth network.

This is a real version of the software used in production, all running locally on your machine!

## components

The components we are about to run you will get to know a lot more over the next 2 days.  We are about to start:

 * **validator** - the core process of a sawtooth network - it replicates blocks to peers and validates new blocks being submitted by clients
 * **rest api** - gives a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) interface to the validator so you can write programs that query state and submit new transactions
 * **shell** - a command line interface with various useful clients that can speak to the validator
 * **settings-tp** - a transaction processor responsible for the settings applied to the whole network of validators
 * **intkey-tp** - a transaction processor that provides functions that can be used to test deployed ledgers.
 * **xo-tp** - a transaction processor for the XO demo

## fetch manifest

We will use a docker compose file that contains instructions for Docker to run the various components listed above.

Make sure you have cloned the code repository using the following command:

```bash
git clone https://github.com/catenasys/training
```

Then get yourself into the `code/compose` folder as follows:

```bash
cd training/code/compose
ls -la
```

You should see a `docker-compose.yaml` file in this directory:

```bash
$ ls -la
-rw-r--r--@ 1 kai  staff  2571 Nov 12 15:45 docker-compose.yaml
```

The contents of this file can be seen as follows:

```yaml
version: "2.1"

networks:
  sawtooth-dev:

services:

  settings-tp:
    image: hyperledger/sawtooth-settings-tp:1.0
    container_name: sawtooth-settings-tp-default
    depends_on:
      - validator
    network: sawtooth-dev
    entrypoint: settings-tp -vv -C tcp://validator:4004

  intkey-tp-go:
    image: hyperledger/sawtooth-intkey-tp-go:1.0
    container_name: sawtooth-intkey-tp-go-default
    depends_on:
      - validator
    network: sawtooth-dev
    entrypoint: intkey-tp-go -vv -C tcp://validator:4004

  xo-tp-go:
    image: hyperledger/sawtooth-xo-tp-go:1.0
    container_name: sawtooth-xo-tp-go-default
    depends_on:
      - validator
    network: sawtooth-dev
    entrypoint: xo-tp-go -vv -C tcp://validator:4004

  validator:
    image: hyperledger/sawtooth-validator:1.0
    container_name: sawtooth-validator-default
    expose:
      - 4004
    ports:
      - "4004:4004"
    network: sawtooth-dev
    # start the validator with an empty genesis batch
    entrypoint: "bash -c \"\
        sawadm keygen && \
        sawtooth keygen my_key && \
        sawset genesis -k /root/.sawtooth/keys/my_key.priv && \
        sawadm genesis config-genesis.batch && \
        sawtooth-validator -vv \
          --endpoint tcp://validator:8800 \
          --bind component:tcp://eth0:4004 \
          --bind network:tcp://eth0:8800 \
        \""

  rest-api:
    image: hyperledger/sawtooth-rest-api:1.0
    container_name: sawtooth-rest-api-default
    expose:
      - 8008
    network: sawtooth-dev
    ports:
      - "8008:8008"
    depends_on:
      - validator
    entrypoint: sawtooth-rest-api -C tcp://validator:4004 --bind rest-api:8008

  shell:
    image: hyperledger/sawtooth-shell:1.0
    container_name: sawtooth-shell-default
    depends_on:
      - rest-api
    network: sawtooth-dev
    entrypoint: "bash -c \"\
        sawtooth keygen && \
        tail -f /dev/null \
        \""

```

> Take a look through the docker-compose file above - it is a good map of the various components needed to run a sawtooth network.


## run sawtooth!

Once you are inside the directory with the `docker-compose.yaml` file - you can use the following command to boot a running sawtooth network (ok - a single node local version but it's the same code we would run in production):

```bash
docker-compose up
```


