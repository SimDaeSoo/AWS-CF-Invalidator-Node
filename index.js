const { CloudFront } = require('aws-sdk');
const cloudfront = new CloudFront({ apiVersion: '2020-05-31' });

exports.handler = async (event) => {
  const keys = event.Records.map(({ s3 }) => {
    const { object } = s3;
    const { key } = object;

    return `/${key}`;
  });

  await invalidation(keys);
};

async function invalidation(keys) {
  const params = {
    DistributionId: process.env.DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: keys.length,
        Items: keys
      }
    }
  };

  return cloudfront.createInvalidation(params).promise();
}