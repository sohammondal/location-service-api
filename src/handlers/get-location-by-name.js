const AWS = require('aws-sdk');
AWS.config.update({
    correctClockSkew: true
});

exports.getLocationByName = async (event) => {
    const s3 = new AWS.S3();
    const Bucket = 'location-data-test';
    const params = event.pathParameters;
    
    if (params && params.name) {

        const locationName = params.name.toLowerCase();

        try {

            const resp = await s3.getObject({
                Bucket,
                Key: locationName
            }).promise();

            return {
                statusCode: 200,
                body: resp.Body.toString()
            }

        } catch (error) {
            console.log('ERROR:', error.message);

            if (error.code === "NoSuchKey") {
                return {
                    statusCode: 404,
                    body: `Location '${locationName}' not found`
                }
            }

            return {
                statusCode: 500,
                body: 'Internal Server Error'
            }
        }

    }

}