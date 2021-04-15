// https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#CannedACL
// https://forums.aws.amazon.com/thread.jspa?messageID=689041&#689041
// https://www.npmjs.com/package/aws-sdk

console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });



// Import required AWS SDK clients and commands for Node.js
const {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand
 } = require("@aws-sdk/client-s3");

 // Set the AWS region
const REGION = "ap-northeast-1";

// Set the bucket parameters
const bucketName = "technocracy.works";
const bucketParams = { Bucket: bucketName };

// Create name for uploaded object key
// const keyName = "hello_world.txt";
// const objectParams = { Bucket: bucketName, Key: keyName, Body: "Hello World!" };

// Create an S3 client service object
const s3 = new S3Client({ region: REGION });


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const { ContentType } = await s3.getObject(params).promise();
        console.log('CONTENT TYPE:', ContentType);
        return ContentType;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};



// s3.putObject({
//     Bucket: bucket,
//     Key: key,
//     ContentType: res.headers['content-type'],
//     ContentLength: res.headers['content-length'],
//     ACL: 'public-read', //<<< this is the key
//     Body: body
// })


// var AWS = require("aws-sdk")
// AWS.config.credentials = myCredentials
// var s3 = new AWS.S3()

// var params = {
//   Bucket: myBucket,
//   Delete: { Objects: ['/invoices/2015/11/02/700CBB21-079A-4633-B305222EBB3E5E9F.pdf'] }
// }

// s3.deleteObjects(params, function(err, data) {
//   console.log(err)
//   console.log(data)  // output here seems as my Key has been deleted.
// })


// const run = async () => {
//   // Create S3 bucket
//   try {
//     const data = await s3.send(new CreateBucketCommand(bucketParams));
//     console.log("Success. Bucket created.");
//   } catch (err) {
//     console.log("Error", err);
//   }
//   try {
//     const results = await s3.send(new PutObjectCommand(objectParams));
//     console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
//   } catch (err) {
//     console.log("Error", err);
//   }
// };
// run();