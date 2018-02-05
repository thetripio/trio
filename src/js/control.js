var Web3 = require('Web3')
var provider = new Web3
    .providers
    .HttpProvider("http://127.0.0.1:7545");
var TruffleContract = require("truffle-contract");
web3 = new Web3(provider);

var fs = require("fs");
// Get content from file
var contents = fs.readFileSync("../../build/contracts/TrioToken.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);

var TutorialTokenArtifact = jsonContent;
var TutorialToken = TruffleContract(TutorialTokenArtifact);
TutorialToken.setProvider(web3.currentProvider);
if (typeof TutorialToken.currentProvider.sendAsync !== "function") {
    TutorialToken.currentProvider.sendAsync = function() {
        return TutorialToken.currentProvider.send.apply(
            TutorialToken.currentProvider, arguments
        );
    };
}
web3
    .eth
    .getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[1];
        TutorialToken
            .deployed()
            .then(function (instance) {
                tutorialTokenInstance = instance;
                //
                // tutorialTokenInstance.transfer('0x99a8eBdFd2101daCad6313eba309620FB5f8dd37',
                // 10000, {from: account});
                // tutorialTokenInstance.transfer('0x99a8eBdFd2101daCad6313eba309620FB5f8dd37',100000000000000000, {from: account});
                tutorialTokenInstance.burn(1000000000000000000, {from: account});

                return tutorialTokenInstance.totalSupply();
            })
            .then(function (result) {
                console.log(result)
                balance = result.c[0];

                console.log(balance)
            })
            .catch(function (err) {
                console.log(err.message);
            });
    });