/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Eventsearch extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                "eventID": "1",
                "eventType": "TRANSPORT",
                "eventDateTime": "2015-07-20T15:49:04-07:00",
                "eventClassifierCode": "ACT",
                "eventTypeCode": "ARRI",
                "transportReference": "9648714",
                "transportLegReference": "025E",
                "facilityTypeCode": "POTE",
                "UNLocationCode": "USNYC",
                "facilityCode": "AEAUHADT",
                "otherFacility": "Depot location or address",
                "modeOfTransportCode": "1"
              }
            
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.id, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.id} initialized`);
        }
    }


    
    async EventQuery(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); 

        // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
           
            return "no container found"
        }
        return assetJSON.toString();
    }

    async CreateEvent(ctx, obj) {
		const exists = await this.AssetExists(ctx, obj.eventID);
		if (exists) {
			throw new Error(`The asset ${obj.eventID} already exists`);
		}

		// ==== Create asset object and marshal to JSON ====
		let asset = obj


		// === Save asset to state ===
		await ctx.stub.putState(obj.eventID, Buffer.from(JSON.stringify(asset)));
		return obj.toString();
		
	}


}

module.exports = ContainerSearch;
