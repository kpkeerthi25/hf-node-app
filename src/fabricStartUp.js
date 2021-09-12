const fs = require('fs');
const path = require('path');

var config = require('./config.json');

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../src/utils/fabricCA');
const { buildCCPOrg1,buildWallet } = require('../src/utils/fabricUtils');


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

var contract = null;

async function main(){
    try {
        const ccp = buildCCPOrg1();
    
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, config.caHostname);
    
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, config.walletPath);
    
        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, config.mspOrg1);
    
        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, config.mspOrg1, config.org1UserId, config.affiliation);
    
        const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: config.org1UserId,
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(config.channelName);
    
            // Get the contract from the network.
            contract = network.getContract(config.chaincodeName);
    
            console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            await contract.submitTransaction('InitLedger');
            console.log('*** Result: committed');
    
    } catch(error) {
        console.log("Failed to register and enroll user", error)
    }
}

main()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        // Deal with the fact the chain failed
    });

module.exports.execTransaction = async (transaction, evaluate = true, params = null) => {

    // const channelName = 'mychannel';
    // const chaincodeName = 'containerSearch';
    // const mspOrg1 = 'Org1MSP';
    // const walletPath = path.join(__dirname, 'wallet');
    // const org1UserId = 'appUser3';

    try {
        const result =
            evaluate ?
                params ?
                    await contract.evaluateTransaction(transaction, ...params) :
                    await contract.evaluateTransaction(transaction)
                :
                await contract.submitTransaction(transaction, ...params);
        return result
       
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}