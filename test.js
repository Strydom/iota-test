let IOTA = require('iota.lib.js');
const fs = require('fs');

/*
 * The API endpoints of the IOTA node(s)
 */
let nodeEndpoints = [
    {
        name: "node0",
        node: {
            provider: 'http://35.231.247.62:14265'
        }
    },
    {
        name: "global",
        node: {
            provider: 'http://35.231.127.74:14265'
        }
    }
];

let IOTAnode = nodeEndpoints[1], // select an endpoint to send requests to
    iota = new IOTA(IOTAnode.node); // Create an IOTA instance with the given endpoint

// These addresses are predefined in the generated Snapshot. If you use a different Snapshot then change accordingly.
const from = 'NEMGZSTESBBEXHQLJMTMGXUXCCRTNQGJRZWUOJCWXPDHHWLOKQZLPUMCXPMXUFSPVLHGTITTAKKQTXEMA',
    to = "CZNWENMG99MPKTFDMLZL9OXPZOKBHSWCZYNHTFBXWAHNMX9IEMWFQKBHCWAAUSPGTY9FQLRNSMBLOB9QW";

/*
 * Send X transactions every Y seconds for Z times
 */
sendTransactionsPeriodically(1, 30, 20);

function sendTransactionsPeriodically(count = 1, interval = 1, repeatCount = 5) {
    let headers = "index, status, sent, received, duration, attachment time, actual duration",
        writeStream = fs.createWriteStream("tests/transactions.csv"),
        originalRepeatCount = repeatCount,
        desiredTime = (interval * repeatCount) - interval,
        totalIndex = 0, startTime, endTime, totalTime;

    writeStream.write(headers);

    let repeat = setInterval(function () {
        let transactionResults = [];

        if (repeatCount === originalRepeatCount) {
            startTime = Date.now();
            console.log(startTime + ": Starting test against - " + IOTAnode.name);
            console.log("Sending " + count + " transactions " + repeatCount + " times in " + interval + " second intervals");
        }

        console.log("Sending transactions...");
        for (let i = 0; i < count; i++) {
            transactionResults.push(timedTransaction(totalIndex++))
        }

        console.log("Gathering and saving results...");
        for (let i = 0; i < count; i++) {
            transactionResults[i]
                .catch(errorResult => {
                    writeStream.write("\r\n" + errorResult.generateErrorCSVString());
                })
                .then(successResult => {
                    writeStream.write("\r\n" + successResult.generateSuccessCSVString());
                });
        }

        if (--repeatCount === 0) {
            clearInterval(repeat);
            Promise.all(transactionResults).then(() => {
                endTime = Date.now();
                totalTime = (endTime - startTime) / 1000;
                console.log(endTime + ": Finished tests against - " + IOTAnode.name);
                console.log("Tests desired time: " + desiredTime + " seconds");
                console.log("Tests actual time: " + totalTime + " seconds");
                console.log("Response overhead: " + (totalTime - desiredTime) + " seconds");
            })
        }

        console.log(repeatCount + " transaction bursts left");
    }, 1000 * interval);

    writeStream.on('error', function (err) {
        console.log(err);
    });
}

function timedTransaction(index = 0) {
    const transfers = [
        {
            value: 0,
            address: to,
            message: ""
        }
    ];

    return new Promise((resolve, reject) => {
        const start = Date.now();
        iota.api.sendTransfer(from, 1, 13, transfers, (error, success) => {
            const end = Date.now(),
                time = end - start;

            if (error) {
                reject(new Result(index, false, start, end, time, error));
            } else {
                resolve(new Result(index, true, start, end, time, success));
            }
        });
    });
}

function Result(index, status, start, end, time, result) {
    this.index = index;
    this.status = status;
    this.start = start;
    this.end = end;
    this.time = time;
    this.result = result;

    this.generateSuccessCSVString = function () {
        const actualEnd = this.result[0].attachmentTimestamp;
        return this.index + ", " +
            this.status + ", " +
            this.start + ", " +
            this.end + ", " +
            (this.time / 1000) + ", " +
            actualEnd + ", " +
            ((actualEnd - this.start) / 1000);
    };
    this.generateErrorCSVString = function () {
        return this.index + ", " +
            this.status + ", " +
            this.start + ", " +
            this.end + ", " +
            (this.time / 1000) + ", " +
            "" + ", " +
            "";
    };
}