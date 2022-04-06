import mongoose from 'mongoose';
import { PriorAuth } from './src/models';
const data = {
    "member": {
        "system": "FCTCR",
        "groupId": "00060290",
        "hcid": "518T6067247576896",
        "qualifier": "0",
        "birthDate": "1980-01-01",
        "firstName": "JOHNY",
        "middleName": "NULL",
        "lastName": "KERT",
        "state": "KY"
    },
    "details": [
        {   
            "authId": "UM53143262", //identifiers.clinical.authId
            "type": "Anthem.UM.PriorAuthApproved", //input.type
            "status": "PENDED", // clinical.status
            "statusMessage": "PENDED", // clinical.statusMessage
            "statusReason": "PENDED Per Script", //clinical.statusReason
            "source": "/um/clinical/review/pahub/UM53143262", //input.source
            "time": "2021-11-03T12:27:57.000Z", //input.time
            "datacontenttype": "application/json", //input. datacontenttype
            "statusEvents": [
                {
                    // "eventId": "01FNRYEZ29PK2HE80PJREREK8M",

                    "status": "PENDED", // clinical.status
                    "statusMessage": "IN_CLINICAL_REVIEW", // clinical.statusMessage
                    "statusReason": "Approved Per Script", //clinical.statusReason

                    "received": "2021-11-03T12:27:57.000Z", // clinical.received

                    "requestId": "", //identifiers.clinical.requestId
                    "disputeId": "", //identifiers.clinical.disputeId
                    "lineOfBusiness": "Commercial", //identifiers.clinical.lineOfBusiness
                    

                    "supportedBy": [
                        {
                            "info": {
                                "type": "NDC",
                                "typeCode": [
                                    "66689030708"
                                ],
                                "statusCode": "PENDED",
                                "reasonCode": "PENDED Received",
                                "statusMessage": "PENDED",
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
                    },
                    "createdTime": "2021-11-12T15:02:31.000Z",
                    "updatedTime": "2021-11-18T10:53:22.208Z"
                }
            ]
        }
    ]
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
            // "details.authId": data.event.authId
        },
        {
            $set: {
                ...data
            },
            // $addToSet : { "details.$.statusEvents" : data.event.statusEvent} 
        },
        {
            upsert: true
        }
    )
    console.log(JSON.stringify(result, null, 2))
}
run();
