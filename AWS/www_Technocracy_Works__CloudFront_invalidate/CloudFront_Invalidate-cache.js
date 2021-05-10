// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/cloudFront.html 

console.log('Loading event');

var AWS = require('aws-sdk');
AWS.config.apiVersions = {cloudfront: '2020-05-31'};
var cloudFront = new AWS.CloudFront();



exports.handler = async event => {
    _log('Received event: ', event);

    const s3BucketToCloudFrontDistributionId = {
        //"S3 Bucket": "CloudFront Distribution ID",
        "technocracy.works": "E3UQOMJO4R85Y9",
        "richiebartlett-com": "E33GBX2OAB03UP"
    };
    // const distributionId = s3BucketToCloudFrontDistributionId[getS3BucketFromEvent(event)];
_log("s3BucketToCloudFrontDistributionId", s3BucketToCloudFrontDistributionId[getS3BucketFromEvent(event)]);

    const paths = getPathsFromEvent(event);
    const params = {
        DistributionId:'E3UQOMJO4R85Y9',
        InvalidationBatch: {
            CallerReference: new Date().getTime().toString(),
            Paths: paths
        }
    };

    // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property
    await cloudFront
        .createInvalidation(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);
            }
        })
        .promise();
    _log("invalidate", paths.Items[0]);
};

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
    //     '*.svg'
    // ]
    return event.Records[0].s3.object.key;
}

function _log(caption, object) {
    console.log(caption + ": " + JSON.stringify(object, true, '  '));
}