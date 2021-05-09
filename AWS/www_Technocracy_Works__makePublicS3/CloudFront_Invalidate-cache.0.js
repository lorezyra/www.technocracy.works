// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/cloudFront.html 


console.log('Loading event');

var Q = require('q');
var AWS = require('aws-sdk');

var params = {
    DistributionId: 'E3UQOMJO4R85Y9',
    /* Technocracy.Works */
    InvalidationBatch: {
        CallerReference: '' + new Date().getTime(),
        Paths: {
            Quantity: '1',
            Items: [
                '*.html',
                '*.js',
                '*.css',
                '*.jpg',
                '*.gif',
                '*.png',
                '*.svg'
            ]
        }
    }
};

AWS.config.apiVersions = {
    cloudfront: '2020-05-31'
};

var cloudFront = new AWS.CloudFront();


exports.handler = function (event, context) {
    _log('Received event: ', event);

    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    console.log('Bucket: ' + bucket);
    console.log('Key: ' + key);

    cloudFront.listDistributions({}, function (err, data) {
        var promises = [];
        if (err) {
            _log('Error: ', err);
            context.done('error', err);
            return;
        }

        // Find a bucket which uses the backet as a origin.
        data.Items.map(function (distribution) {
            var deferred = Q.defer();
            var exists = false;

            distribution.Origins.Items.map(function (origin) {
                if (exists) return;

                if (origin.DomainName.indexOf(bucket) === 0) {
                    exists = true;
                    var name = distribution.DomainName;
                    if (distribution.Aliases.Quantity > 0) {
                        name = distribution.Aliases.Items[0];
                    }
                    console.log('Distribution: ' + distribution.Id + ' (' + name + ')');

                    // Parameters for a invalidation
                    var params = {
                        DistributionId: distribution.Id,
                        InvalidationBatch: {
                            CallerReference: '' + new Date().getTime(),
                            Paths: {
                                Quantity: 1,
                                Items: ['/' + key]
                            }
                        }
                    };
                    _log('Params: ', params);

                    // Invalidate
                    cloudFront.createInvalidation(params, function (err, data) {
                        if (err) {
                            _log('Error: ', err);
                            deferred.reject();
                            return;
                        }
                        _log('Success: ', data.InvalidationBatch);
                        deferred.resolve();
                    });
                }
            });
            if (!exists) deferred.resolve();
            promises.push(deferred.promise);
        });
        Q.all(promises).then(function () {
            context.done(null, '');
        });
    });

    function _log(caption, object) {
        console.log(caption + JSON.stringify(object, true, '  '));
    }

};


