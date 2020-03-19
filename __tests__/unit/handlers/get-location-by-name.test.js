const path = require('path');
const HOMEDIR = path.join(__dirname, '..', '..', '..');
const AWS = require('aws-sdk');
const lambda = require(path.join(HOMEDIR, 'src', 'handlers', 'get-location-by-name.js'));

describe('Test getLocationByName', function () {

    it('should return a location object', async () => {

        const mockLocationData = {
            lat: 22.5726,
            lng: 88.3639,
        }

        const mockResponseBody = Buffer.from(JSON.stringify(mockLocationData))

        const s3getObjectPromise = jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Body: mockResponseBody
            })
        })

        AWS.S3 = jest.fn().mockImplementation(() => ({
            getObject: s3getObjectPromise
        }))


        const event = {
            httpEvent: 'GET',
            pathParameters: {
                name: 'berlin'
            }
        }

        const resp = await lambda.getLocationByName(event);
        const expectedResp = {
            ...mockLocationData,
            distance: {
                value: 7030.28086939495,
                unit: "KM",
                description: "Bee line distance to Klima.Metrix office from the requested location (in KMs)"
            }
        }
        expect(resp.body).toBe(JSON.stringify(expectedResp));


    })

    it('should return statusCode 404 if location not found', async () => {

        const s3getObjectPromise = jest.fn().mockReturnValue({
            promise: jest.fn().mockRejectedValue({
                message: "Key not found",
                code: "NoSuchKey"
            })
        })

        AWS.S3 = jest.fn().mockImplementation(() => ({
            getObject: s3getObjectPromise
        }))

        const event = {
            httpEvent: 'GET',
            pathParameters: {
                name: 'berlin'
            }
        }

        const resp = await lambda.getLocationByName(event);
        expect(resp.statusCode).toBe(404);
    })

})