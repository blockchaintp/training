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

Example contract:

```
pragma solidity ^0.4.0;

contract intkey {
  mapping (uint => uint) intmap;

  event Set(uint key, uint value);

  function set(uint key, uint value) public {
    intmap[key] = value;
    emit Set(key, value);
  }

  function inc(uint key) public {
    intmap[key] = intmap[key] + 1;
  }

  function dec(uint key) public {
    intmap[key] = intmap[key] - 1;
  }

  function get(uint key) public constant returns (uint retVal) {
    return intmap[key];
  }
}
```
