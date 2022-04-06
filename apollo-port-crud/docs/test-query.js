import mongoose from 'mongoose';
import { PriorAuth } from './src/models';

const data = {
    "member": {
        "system": "FCTCR",
        "groupId": "00060290",
        "hcid": "518T60672",
        "qualifier": "0",
        "birthDate": "1980-01-01",
        "firstName": "JOHNY",
        "middleName": "NULL",
        "lastName": "KERT",
        "state": "KY"
    },
    "event": {

        "authId": "UM53143262",
        "type": "Anthem.UM.PriorAuthApproved",
        
        "status": "PENDED",
        "statusMessage": "PENDED",
        "statusReason": "PENDED",

        
        "source": "/um/clinical/review/pahub/UM53143262",
        "time": "2009-11-03T12:27:57.000Z",
        "datacontenttype": "application/json",

        "statusEvent": {
            // "eventId": new mongoose.Types.ObjectId(), -- this will be created inside schema

            "status": "PENDED",
            "statusMessage": "PENDED",
            "statusReason": "PENDED",

            "received": "2009-11-03T12:27:57.000Z",

            "requestId": "",
            "disputeId": "",
            "lineOfBusiness": "Commercial",
            

            "supportedBy": [
                {
                    "info": {
                        "type": "NDC",
                        "typeCode": [
                            "66689030708"
                        ],
                        "statusCode": "PENDED",
                        "reasonCode": "PENDED",
                        "statusMessage": "PLANNED",
                        "description": "MYCOPHENOLATE 200 MG/ML SUSP",
                        "placeOfService": "",
                        "startDate": "2021-11-03",
                        "endDate": "2021-11-03",
                        "decisionDate": "String",
                        "servicelineType": "String",
                        "serviceDays": 10
                    }
                }
            ],
            "requestedBy": [
                {
                    "id": "",
                    "npi": "1477559086",
                    "taxId": "999999999",
                    "medicareId": ""
                }
            ],
            "servicedBy": [
                {
                    "id": "",
                    "npi": "",
                    "taxId": "",
                    "medicareId": ""
                }
            ],
            "turnAroundTime": {
                "actualDuration": {
                    "unit": "a",
                    "value": "String"
                },
                "businessPeriod": {
                    "end": "String",
                    "start": "String"
                },
                "expectedDuration": {
                    "unit": "a",
                    "value": "String"
                },
                "extension": true
            }
        }
    }
}

const run = async () => {
    const DB = 'mongodb://localhost:27017/post-gql-app'
    await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const result = await PriorAuth.updateOne(
        {
            // "member.system": data.member.system,
            // "member.groupId": data.member.groupId,
            "member.hcid": data.member.hcid,
            // "member.qualifier": data.member.qualifier,
            // "member.birthDate": data.member.birthDate,
            // "member.firstName": data.member.firstName,
            // "member.middleName": data.member.middleName,
            // "member.lastName": data.member.lastName,
            // "member.state": data.member.state,
            "details.authId": data.event.authId
        },
        {
            $set: {
                "details.$.type" : data.event.type,
                "details.$.status" : data.event.status,
                "details.$.statusMessage" : data.event.statusMessage,
                "details.$.statusReason" : data.event.statusReason,
                "details.$.source" : data.event.source,
                "details.$.time" : data.event.time,
                "details.$.datacontenttype" : data.event.datacontenttype
            },
            $addToSet : { "details.$.statusEvents" : data.event.statusEvent} 
        },
        {
            upsert: true
        }
    )
    console.log(JSON.stringify(result, null, 2))
}
run();