const AWS = require('aws-sdk');

exports.getAllLocations = async (event) => {

    return {
        statusCode:200,
        body: 'Success'
    }

}