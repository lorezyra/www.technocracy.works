// https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/cloudfront-example-invalidation.html

// require 'vendor/autoload.php';

use Aws\CloudFront\CloudFrontClient; 
use Aws\Exception\AwsException;

function createInvalidation($cloudFrontClient, $distributionId, 
    $callerReference, $paths, $quantity)
{
    try {
        $result = $cloudFrontClient->createInvalidation([
            'DistributionId' => $distributionId,
            'InvalidationBatch' => [
                'CallerReference' => $callerReference,
                'Paths' => [
                    'Items' => $paths,
                    'Quantity' => $quantity,
                ],
            ]
        ]);

        $message = '';

        if (isset($result['Location']))
        {
            $message = 'The invalidation location is: ' . 
                $result['Location'];
        }

        $message .= ' and the effective URI is ' . 
            $result['@metadata']['effectiveUri'] . '.';

        return $message;
    } catch (AwsException $e) {
        return 'Error: ' . $e->getAwsErrorMessage();
    }
}

function createTheInvalidation()
{
    $distributionId = 'E1WICG14DUW2AP'; // 'E17G7YNEXAMPLE';
    $callerReference = 'my-unique-value';
    $paths = ['/*'];
    $quantity = 1;

    $cloudFrontClient = new Aws\CloudFront\CloudFrontClient([
        'profile' => 'default',
        'version' => '2018-06-18',
        'region' => 'us-east-1'
    ]);

    echo createInvalidation($cloudFrontClient, $distributionId, 
        $callerReference, $paths, $quantity);
}

// Uncomment the following line to run this code in an AWS account.
// createTheInvalidation();


function listInvalidations($cloudFrontClient, $distributionId)
{
    try {
        $result = $cloudFrontClient->listInvalidations([
            'DistributionId' => $distributionId
        ]);
        return $result;
    } catch (AwsException $e) {
        exit('Error: ' . $e->getAwsErrorMessage());
    }
}

function listTheInvalidations()
{
    $distributionId = 'E1WICG1EXAMPLE';

    $cloudFrontClient = new Aws\CloudFront\CloudFrontClient([
        'profile' => 'default',
        'version' => '2018-06-18',
        'region' => 'us-east-1'
    ]);

    $invalidations = listInvalidations($cloudFrontClient, 
        $distributionId);

    if (isset($invalidations['InvalidationList']))
    {
        if ($invalidations['InvalidationList']['Quantity'] > 0)
        {
            foreach ($invalidations['InvalidationList']['Items'] as $invalidation)
            {
                echo 'The invalidation with the ID of ' . $invalidation['Id'] . 
                    ' has the status of ' . $invalidation['Status'] . '.' . "\n";
            }
        } else {
            echo 'Could not find any invalidations for the specified distribution.';
        }
    } else {
        echo 'Error: Could not get invalidation information. Could not get ' . 
            'information about the specified distribution.';
    }   
}

// Uncomment the following line to run this code in an AWS account.
// listTheInvalidations();

function getDistribution($cloudFrontClient, $distributionId)
{
    try {
        $result = $cloudFrontClient->getDistribution([
            'Id' => $distributionId
        ]);

        $message = '';

        if (isset($result['Distribution']['Status']))
        {
            $message = 'The status of the distribution with the ID of ' . 
                $result['Distribution']['Id'] . ' is currently ' . 
                $result['Distribution']['Status'];
        }
        
        if (isset($result['@metadata']['effectiveUri']))
        {
            $message .= ', and the effective URI is ' . 
                $result['@metadata']['effectiveUri'] . '.';
        } else {
            $message = 'Error: Could not get the specified distribution. ' .
                'The distribution\'s status is not available.';
        }

        return $message;

    } catch (AwsException $e) {
        return 'Error: ' . $e->getAwsErrorMessage();
    }
}

function getsADistribution()
{
    $distributionId = 'E1BTGP2EXAMPLE';

    $cloudFrontClient = new Aws\CloudFront\CloudFrontClient([
        'profile' => 'default',
        'version' => '2018-06-18',
        'region' => 'us-east-1'
    ]);
    
    echo getDistribution($cloudFrontClient, $distributionId);
}

// Uncomment the following line to run this code in an AWS account.
// getsADistribution();