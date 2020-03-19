const AWS = require('aws-sdk');
AWS.config.update({
    correctClockSkew: true
});

exports.getLocationByName = async (event) => {
    const s3 = new AWS.S3();
    const Bucket = 'location-data-test';
    const KlimaMetrixOfficeCoords = {
        lat: 52.502931,
        lng: 13.408249
    }
    const {
        beelineDistanceCalculatorService
    } = require('../services/services');
    const params = event.pathParameters;

    if (params && params.name) {

        const locationName = params.name.toLowerCase();

        try {

            const resp = await s3.getObject({
                Bucket,
                Key: locationName
            }).promise();

            let locationInfo = resp.Body.toString();
            locationInfo = JSON.parse(locationInfo);

            //Bee line distance to Klima.Metrix office (in KMs)
            const distance = beelineDistanceCalculatorService(KlimaMetrixOfficeCoords, {
                lat: locationInfo.lat,
                lng: locationInfo.lng
            });

            return {
                statusCode: 200,
                body: JSON.stringify({
                    ...locationInfo,
                    distance: {
                        value: distance,
                        unit: 'KM',
                        description: "Bee line distance to Klima.Metrix office from the requested location (in KMs)"
                    }
                })
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