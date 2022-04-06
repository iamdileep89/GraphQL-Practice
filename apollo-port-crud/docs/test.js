import mongoose from 'mongoose';
import { PriorAuth } from './src/models';
import { PriorAuthDetailSchema } from './src/models/schema';

const id = mongoose.Types.ObjectId()
console.log(id.toString());

const data = {
    "member": {
        "system": "FCTCR",
        "groupId": "00060290",
        "hcid": "518T6067247576",
        "qualifier": "0",
        "birthDate": "1980-01-01",
        "firstName": "JOHNYYY",
        "middleName": "NULL",
        "lastName": "KERT",
        "state": "KY"
    },
    "details": [
        {   
            "authId": "UM53143262",
            "type": "Anthem.UM.PriorAuthApproved",
            
            "status": "APPROVED",
            "statusMessage": "APPROVED",
            "statusReason": "Approved Per Script",

            
            "source": "/um/clinical/review/pahub/UM53143262",
            "time": "2009-11-03T12:27:57.000Z",
            "datacontenttype": "application/json",

            "statusEvents": [
                {
                    // "eventId": new mongoose.Types.ObjectId(), -- this will be created inside schema

                    "status": "RECEIVED",
                    "statusMessage": "IN_CLINICAL_REVIEW",
                    "statusReason": "Approved Per Script",

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
                                "statusCode": "RECEIVED",
                                "reasonCode": "Request Received",
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
            ]
        }
    ]
}
// const a = new PriorAuthDetailSchema();
// console.log(a);
const b = new PriorAuth();
console.log(b);


// const run = async () => {
//     const DB = 'mongodb://localhost:27017/post-gql-app'
//     await mongoose.connect(DB, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     const result = await PriorAuth.create({...data});
//     console.log(JSON.stringify(result, null, 2))
//     // let data1 = await PriorAuth.find()
//     // // let res = data1.toObject()
//     // console.log(JSON.stringify(data1, null, 2))
// }
// run();