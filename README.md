# IOTA Testing Tools

## Setting up a node

##### To start up a private IOTA IRI you need to create a custom Snapshot.txt

You can do this using the tools found [here](https://github.com/schierlm/private-iota-testnet)

1. `mvn package`
2. `java -jar target/iota-testnet-tools-0.1-SNAPSHOT-jar-with-dependencies.jar SnapshotBuilder`
3. Copy Snapshot.txt to iri/src/main/resources
4. Comment out the part that validates the snapshot signature in [Snapshot.jar](https://github.com/iotaledger/iri/blob/b95606fc83f03a415750e6c1377d96a200badd6f/src/main/java/com/iota/iri/Snapshot.java#L39-L41)

##### Then re-build IRI

1. `mvn clean compile`
2. `mvn package`

##### Then run IRI using the given config

`java -jar target/iri-1.4.2.2.jar -c iri-config-1.ini`

##### Then create a milestone using the coordinator found in the tools liked above

`java -jar target/iota-testnet-tools-0.1-SNAPSHOT-jar-with-dependencies.jar Coordinator localhost 14700`

## Running app.js

1. `npm intall`
2. `npm start`

If you want to use the PoWBox then simply add:

```javascript
const remoteCurl = require('@iota/curl-remote');
remoteCurl(iota, `https://powbox.testnet.iota.org`, 500, 'YOUR_API_KEY');
```