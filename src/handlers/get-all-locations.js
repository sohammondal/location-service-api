const AWS = require('aws-sdk');
AWS.config.update({
    correctClockSkew: true
});
exports.getAllLocations = async (event) => {
    
    const s3 = new AWS.S3();
    const Bucket = process.env.BUCKET_NAME;

    try {
        const resp = await s3.listObjectsV2({Bucket}).promise();
        const locations = resp.Contents.map(content=>content.Key);
        
        return {
            statusCode: 200,
            body: JSON.stringify({locations})
        }

    } catch (error) {

        console.log('ERROR:',error.message);
        return {
            statusCode:500,
            body: 'Internal Server Error'
        }
        
    }

}