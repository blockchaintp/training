## voting tp


### data structure

the structure of our data is:

```
proposal
  name
  proposal
  result - one of VOTING, PASSED, REJECTED, TIE
  votes
  {
    "bob": "yes",
    "alice": "no",
    "harry": "yes",
  }

people
  name
  publicKey
```

### addressing

voting.
       proposal
               .name
       people
             .name

### transaction payloads

 * register
 * create_proposal
 * vote

### read only methods

 * list people
 * list proposals
 * view proposal