// https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#CannedACL
// https://forums.aws.amazon.com/thread.jspa?messageID=689041&#689041
// https://www.npmjs.com/package/aws-sdk
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// https://stackoverflow.com/questions/14375895/aws-s3-node-js-sdk-uploaded-file-and-folder-permissions

const aws = require('aws-sdk');

const REGION = "ap-northeast-1";
const bucketParams = {
    Bucket: 'technocracy.works',
    /* required */
    //   ContinuationToken: 'STRING_VALUE',
    Delimiter: '/',
    //   EncodingType: url,
    //   ExpectedBucketOwner: 'STRING_VALUE',
    FetchOwner: true,
    MaxKeys: '1000',
    //   Prefix: 'STRING_VALUE',
    //   RequestPayer: requester,
    //   StartAfter: 'STRING_VALUE'
};

const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    region: REGION,
    maxRetries: 2
});


exports.handler = async(event, context) => {
    console.log('exports.handler()');
    // console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    // const bucket = event.Records[0].s3.bucket.name;
    // const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    var params = {
        Bucket: bucketParams.Bucket,
        Key: "robots.txt"
    };
    // console.log("params", params);
    
    
    try {
        var { ContentType } = await s3.getObject(params).promise();
        console.log('CONTENT TYPE:', ContentType);

        listFiles(bucketParams);
        // console.log("bucketParams", bucketParams);
        s3.listObjectsV2(bucketParams, function(err, data) {
            if (err) {
                console.log("exports Error ", err);
            }
            else {
                console.log("s3.listObjectsV2() data", data.Contents);
                console.log("params", params);
                s3.getObject(params, function(err, data) {
                    if (err) {
                        console.log("s3.getObject() ERROR ", err, err.stack); // an error occurred
                    }
                    else {
                        /*
                        data = {
                         AcceptRanges: "bytes", 
                         ContentLength: 3191, 
                         ContentType: "image/jpeg", 
                         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
                         LastModified: <Date Representation>, 
                         Metadata: {}, 
                         TagCount: 2, 
                         VersionId: "null"
                        }
                        */
                        console.log("s3.getObject() data: ", data); // successful response
                        return data;

                    }
                });

            }
        });
        // listFiles(bucketParams);

        // return ContentType; //{"Status": 200}
        return {"Status": 200};

    }
    catch (err) {
        console.log(err);
        let message = `Error getting object ${params.key} from bucket ${bucketParams.Bucket}. Check: object(s) exist; bucket = same region as this function.`;
        console.log(message);
        // throw new Error(message);
    }
};



var listFiles = function(bucketParams) {
    console.log("function listFiles (", bucketParams, ")");

    // Call S3 to obtain a list of the objects in the bucket
    try {
        s3.listObjectsV2(bucketParams, function(err, data) {
            if (err) {
                console.log("listFiles() Error", err);
            }
            else {
                console.log("s3.listObjectsV2() data", data);
                // data = {
                //     Contents: [{
                //             ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"",
                //             Key: "happyface.jpg",
                //             LastModified: < Date Representation > ,
                //             Size: 11,
                //             StorageClass: "STANDARD"
                //         },
                //         {
                //             ETag: "\"becf17f89c30367a9a44495d62ed521a-1\"",
                //             Key: "test.jpg",
                //             LastModified: < Date Representation > ,
                //             Size: 4192256,
                //             StorageClass: "STANDARD"
                //         }
                //     ],
                //     IsTruncated: true,
                //     KeyCount: 2,
                //     MaxKeys: 2,
                //     Name: "examplebucket",
                //     NextContinuationToken: "1w41l63U0xa8q7smH50vCxyTQqdxo69O3EmK28Bi5PcROI4wI/EyIJg==",
                //     Prefix: ""
                // }


                // console.log("Success", data);
                var keyCnt = data.KeyCount;

                console.log("keyCnt=", keyCnt);

                // var objParams = {
                //     Bucket: data.Name,
                //     Key: data.Contents[x].Key
                // };

                console.log("bucket=", data.Name);

                data.Contents.map(getFileAcl, this); //loop through Contents

            }
        });

        return;
    }
    catch (err) {
        console.log(err);
    }
};



var getFileAcl = function(objectKey) {

    try {
        console.log("function getFileAcl (", objectKey, ")");
        // const { fileObjACL } = await s3.getObjectAcl(objectKey).promise();
        // console.log('File ACL:', fileObjACL);

        // s3.getObjectAcl(objParams, function (err, data) {
        //     if (err) {
        //         console.log("Error", err);
        //     }
        //     else {
        //         console.log("Success", data);
        /*
                data = {
                         Grants: [
                            {
                           Grantee: {
                            DisplayName: "owner-display-name", 
                            ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc", 
                            Type: "CanonicalUser"
                           }, 
                           Permission: "WRITE"
                          }, 
                            {
                           Grantee: {
                            DisplayName: "owner-display-name", 
                            ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc", 
                            Type: "CanonicalUser"
                           }, 
                           Permission: "WRITE_ACP"
                          }, 
                            {
                           Grantee: {
                            DisplayName: "owner-display-name", 
                            ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc", 
                            Type: "CanonicalUser"
                           }, 
                           Permission: "READ"
                          }, 
                            {
                           Grantee: {
                            DisplayName: "owner-display-name", 
                            ID: "852b113eexamplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc", 
                            Type: "CanonicalUser"
                           }, 
                           Permission: "READ_ACP"
                          }
                         ], 
                         Owner: {
                          DisplayName: "owner-display-name", 
                          ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
                         }
                        }
        */
        //     }}
        // );


        return;
    }
    catch (err) {
        console.log("getFileAcl() ERROR ", err);
    }
};


var testFunc = function(obj) {
    console.log("function testFunc (", obj, ")");

    try {


        if (obj) return;
    }
    catch (err) {
        console.log("testFunc() ERROR ", err);
    }
};
