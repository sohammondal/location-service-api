const path = require('path');
const HOMEDIR = path.join(__dirname, '..', '..', '..');
const AWS = require('aws-sdk');
const {
    multiPartFormDataRequestBuilder
} = require(path.join(HOMEDIR, 'src', 'utils', 'utils.js'));
const lambda = require(path.join(HOMEDIR, 'src', 'handlers', 'upload-location-file.js'));

describe('Test uploadLocationFile', function () {

    const mockFileName1 = 'berlin.json';
    const mockLocationData1 = {
        lat: 10,
        lng: 12
    }

    const mockFileName2 = 'kolkata.json';
    const mockLocationData2 = {
        lat: 12,
        lng: 14
    }

    const s3UploadtPromise = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
    })

    AWS.S3 = jest.fn().mockImplementation(() => ({
        upload: s3UploadtPromise
    }))


    it('should return statusCode 400 if request body is empty ', async () => {

        const resp = await lambda.uploadLocationFile({
            body: ''
        })
        expect(resp.statusCode).toBe(400);

    })

    it('should return statusCode 404 if request body does not contain multipart form-data', async () => {

        const resp = await lambda.uploadLocationFile({
            body: {

            }
        })
        expect(resp.statusCode).toBe(400);

    })

    it('should return errors in response body if uploaded file content is not a valid JSON', async () => {

        const {
            headers,
            payload
        } = multiPartFormDataRequestBuilder([{

            upfile: mockFileName1,
            content: 'lat:10,lng:10'

        }]);

        const resp = await lambda.uploadLocationFile({
            headers,
            body: payload
        })
        resp.body = JSON.parse(resp.body);

        expect(resp.body).toHaveProperty('errors');

    })

    it('should return response with errors if file content doesn\'t have lat and lng fields', async () => {

        const {
            headers,
            payload
        } = multiPartFormDataRequestBuilder([{

            upfile: mockFileName1,
            content: {
                someOtherField: 10,
                someOtherField2: 12
            }

        }]);

        const resp = await lambda.uploadLocationFile({
            headers,
            body: payload
        })
        resp.body = JSON.parse(resp.body);

        expect(resp.body).toHaveProperty('errors');
        expect(resp.body.errors).toHaveLength(2);

    })

    it('should be able to handle partial uploads', async () => {


        const {
            headers,
            payload
        } = multiPartFormDataRequestBuilder([{

                upfile: mockFileName1,
                content: mockLocationData1

            },
            {

                upfile: mockFileName2,
                content: 'lat:10,lng:10'
            }
        ]);
        const resp = await lambda.uploadLocationFile({
            headers,
            body: payload
        })

        expect(resp.statusCode).toBe(206);
    });

    it('should be able to handle multiple uploads', async () => {

        const {
            headers,
            payload
        } = multiPartFormDataRequestBuilder([{

                upfile: mockFileName1,
                content: mockLocationData1

            },
            {

                upfile: mockFileName2,
                content: mockLocationData2
            }
        ]);
        const resp = await lambda.uploadLocationFile({
            headers,
            body: payload
        })

        expect(resp.statusCode).toBe(200);


    });

})