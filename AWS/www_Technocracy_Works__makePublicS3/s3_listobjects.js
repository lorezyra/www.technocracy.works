/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */


// ABOUT THIS NODE.JS SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
// https://docs.aws.amazon.com/code-samples/latest/catalog/javascript-s3-s3_listobjects.js.html


console.log('Loading function');

// Load the AWS SDK for Node.js
const aws = require('../../node_module/aws-sdk');
// const async = require('async'); // To call AWS operations asynchronously.
const REGION = "ap-northeast-1";
const bucketName = "technocracy.works";
const bucketParams = {
    Bucket: bucketName
};
const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    region: REGION,
    maxRetries: 2
});

// Call S3 to obtain a list of the objects in the bucket
s3.listObjectsV2(bucketParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});