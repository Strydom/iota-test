let IOTA = require('iota.lib.js');

// Create IOTA instance with host and port as provider
let iota = new IOTA({
    'host': 'http://localhost',
    'port': 14000
});

// now you can start using all of the functions
iota.api.getNodeInfo(function(error, success) {
    if (error) {
        console.error(error);
    } else {
        console.log(success);
    }
});

const from = 'NEMGZSTESBBEXHQLJMTMGXUXCCRTNQGJRZWUOJCWXPDHHWLOKQZLPUMCXPMXUFSPVLHGTITTAKKQTXEMA';
const to = "CZNWENMG99MPKTFDMLZL9OXPZOKBHSWCZYNHTFBXWAHNMX9IEMWFQKBHCWAAUSPGTY9FQLRNSMBLOB9QW";
const message = iota.utils.toTrytes('Hello World!');

const transfers = [
    {
        value: 0,
        address: to,
        message: message
    }
];

iota.api.sendTransfer(from, 1, 13, transfers, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log(success)
    }
});