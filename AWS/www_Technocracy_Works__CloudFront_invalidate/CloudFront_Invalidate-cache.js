// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/cloudFront.html 

console.log('Loading event');

var AWS = require('aws-sdk');
AWS.config.apiVersions = { cloudfront: '2020-05-31' };
var cloudFront = new AWS.CloudFront();



exports.handler = async event => {
    _log('Received event', event);

    const params = {
        DistributionId: getDistributionID(event),
        InvalidationBatch: {
            CallerReference: new Date().getTime().toString(),
            Paths: getPathsFromEvent(event)
        }
    };

    // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property
    await cloudFront
        .createInvalidation(params, cfInvalidationCB)
        .promise();
    // _log("invalidate", getPathsFromEvent(event).Items);
};


function getDistributionID(event) {
    const s3BucketToCloudFrontDistributionId = {
        //"S3 Bucket": "CloudFront Distribution ID",
        "technocracy.works": "E3UQOMJO4R85Y9",
        "richiebartlett-com": "E33GBX2OAB03UP"
    };
    // _log("s3BucketToCloudFrontDistributionId", s3BucketToCloudFrontDistributionId[getS3BucketFromEvent(event)]);

    return s3BucketToCloudFrontDistributionId[getS3BucketFromEvent(event)];
}

function getPathsFromEvent(event) {
    console.log(JSON.stringify(event));
    return {
        Quantity: 1,
        Items: ["/" + getS3ObjectsFromEvent(event)]
    };
}

function getS3BucketFromEvent(event) {
    return event.Records[0].s3.bucket.name;
}

function getS3ObjectsFromEvent(event) {
    // Items: [
    //     '*.html',
    //     '*.js',
    //     '*.css',
    //     '*.jpg',
    //     '*.gif',
    //     '*.png',
    //     '*.ico',
    //     '*.svg',
    //     '*.txt',
    //     '*.xml',
    //     '*.json'
    // ]
    // // .html .js .css .jpg .gif .png .ico .svg .txt .xml .json
    return event.Records[0].s3.object.key;
}

function cfInvalidationCB(err, data) {
    /* callback function for cloudFront.createInvalidation(); */
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
}

function _log(caption, object) {
    console.log(caption + ": " + JSON.stringify(object, true, '  '));
}
