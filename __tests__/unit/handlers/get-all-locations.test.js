const path = require('path');
const HOMEDIR = path.join(__dirname, '..', '..', '..');
const AWS = require('aws-sdk');
const lambda = require(path.join(HOMEDIR, 'src', 'handlers', 'get-all-locations.js'));

describe('Test getAllLocations', function () {

    const s3listObjectsV2Promise = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
            Contents: [{
                    Key: 'berlin'
                },
                {
                    Key: 'kolkata'
                },
                {
                    Key: 'paris'
                }
            ]
        })
    })

    AWS.S3 = jest.fn().mockImplementation(() => ({
        listObjectsV2: s3listObjectsV2Promise
    }))


    it('should return a list of location names', async () => {

        const resp = await lambda.getAllLocations();
        expect(resp.body).toBe(
            JSON.stringify({
                locations: ['berlin', 'kolkata', 'paris']
            })
        );


    })

})