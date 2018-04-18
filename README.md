# IOTA Testing Tools

## Setting up an environment using Kubernetes

Follow the instructions at [kubernetes-private-iota](https://github.com/Strydom/kubernetes-private-iota)
to deploy a private IOTA network in Kubernetes.

## Setting up an environment locally

#### 1. Get IRI

Clone, Fork or Download the [IOTA Reference Implementation](https://github.com/iotaledger/iri)

#### 2. Create a custom Snapshot or use the one provided

You can create your own Snapshot using
the [private-iota-testnet](https://github.com/schierlm/private-iota-testnet) tools.
or you can use the [Snapshot.txt](Snapshot.txt) provided in this repository and place it
inside the IRI resource repository `iri\src\main\resources\`
(there should already be one there, just replace it).

#### 3. Build IRI

With the Snapshot inside the IRI repository then:

1. `mvn clean compile`
2. `mvn package`

#### 4. Run the custom IRI build

`java -jar target/iri-1.4.2.2.jar -c config.ini`

Config for a single node:
```ini
[IRI]
PORT = 14000
UDP_RECEIVER_PORT = 14100
TCP_RECEIVER_PORT = 14200
TESTNET = true
DB_PATH = node/db/
DB_LOG_PATH = node/db.log
IXI_DIR = node/ixi
;API_HOST=0.0.0.0
```

Config for multiple nodes:
```ini
;Config 0
[IRI]
PORT = 14000
UDP_RECEIVER_PORT = 14100
TCP_RECEIVER_PORT = 14200
NEIGHBORS = udp://127.0.0.1:14101
TESTNET = true
DB_PATH = node0/db/
DB_LOG_PATH = node0/db.log
IXI_DIR = node0/ixi
;API_HOST=0.0.0.0
```
```ini
;Config 1
[IRI]
PORT = 14001
UDP_RECEIVER_PORT = 14101
TCP_RECEIVER_PORT = 14201
NEIGHBORS = udp://127.0.0.1:14100
TESTNET = true
DB_PATH = node1/db/
DB_LOG_PATH = node1/db.log
IXI_DIR = node1/ixi
;API_HOST=0.0.0.0
```

#### 5. Create a milestone using the coordinator

You can do this using the [private-iota-testnet](https://github.com/schierlm/private-iota-testnet) tools

## Running the tests

1. `npm intall`
2. `npm start`

If you want to try and use the PoWBox then simply add after iota has been instantiated:

```javascript
const remoteCurl = require('@iota/curl-remote');
remoteCurl(iota, `https://powbox.testnet.iota.org`, 500, 'YOUR_API_KEY');
```

## Additional Tools

- [IOTA Peer Manager](https://github.com/akashgoswami/ipm) - For viewing, adding and deleting neighbours.
