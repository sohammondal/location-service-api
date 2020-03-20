const AWS = require('aws-sdk');
AWS.config.update({
    correctClockSkew: true
});

// Schema for the location object
const locationSchema = {
    lat: { type: 'number' },
    lng: { type: 'number' },
    required: [ 'lat', 'lng' ]
}

const sanitizeFileName = (filename) => filename.split('.')[0].toLowerCase()

const formatResponse = (count,success,errors) => {
    
    let statusCode = 200

    if(success.length===0){

        statusCode = 400;

    }else if(success.length < count){

        statusCode = 206;

    }


    let body = {

            totalCount: count,
            successCount: success.length,
            failureCount: count - success.length,
    };
    
    if(errors.length){
        body = {
            ...body,
            errors
        }
    }

    return {
        statusCode,
        body: JSON.stringify(body)
    }

}

exports.uploadLocationFile = async (event) => {

    // if event object has no request body
    // return with 400
    if(!event.body){ 
        return {
            statusCode:400,
            body: 'Missing file(s) in payload'
        }
    }
    
    const s3 = new AWS.S3();
    const parser = require('lambda-multipart-parser');
    const Validator = require("jsonschema").Validator;
    const v = new Validator();
    const {isValidJSON} = require('../utils/utils');
    let parsedRequest;
    
    try {
        parsedRequest = await parser.parse(event); // parse the multipart form-data request
    } catch (error) {
        console.log('ERROR: Parsing error. '+error.message);
        return {
            statusCode:400,
            body: error.message
        }
    }
    

    const promises = []; //to store s3upload promises
    const requestErrors = []; //to store all errors

    try {

        // parse success, lets loop over each file and it's contents
        parsedRequest.files.map((file)=> {

            let locationData = file.content.toString(); // convert one file content to string

            if(!isValidJSON(locationData)){ // check if the content is not a valid JSON Object

                // add to request errors array and
                requestErrors.push({
                    filename: file.filename,
                    message: 'Invalid json content. Must be like { lat:<Number>, lng:<Number> }'
                })

                return;  // skip the iteration

            }

            locationData = JSON.parse(locationData); // Parse the content into a JSON Object

            const validationResult = v.validate(locationData,locationSchema); // Validate if the content is valid info as per location data schema {lat:<number>,lng:<number>}
            
            if(!validationResult.valid){ // if invalid
                
                validationResult.errors.forEach(err=>{
                    
                    // add the errors to request errors array and
                    requestErrors.push({ 
                        filename: file.filename,
                        message: err.message
                    })
                })

                return; // skip the iteration
            }


            // if above checks pass
            // try to upload and push the promises
            // in an arrary
            promises.push(
               
                s3.upload({
                    Body: file.content,
                    Bucket: process.env.BUCKET_NAME, 
                    Key: sanitizeFileName(file.filename)
                }).promise()
            )

        })


        const s3UploadResponses = await Promise.all(promises); // Resolve all the promises

        const resp = formatResponse(parsedRequest.files.length,s3UploadResponses,requestErrors); // Format the response

        return resp;
        

    } catch (error) {
        console.log('ERROR:',error.message);
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        }
    }
    

}