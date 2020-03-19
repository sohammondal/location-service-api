const AWS = require('aws-sdk');

exports.getLocationByName = async (event) => {

    return {
        statusCode:200,
        body: 'Success'
    }

}