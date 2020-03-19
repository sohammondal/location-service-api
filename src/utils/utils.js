/**
* This function mocks the multipart request builder
*  It takes an array of File Objects { upfile:'',content:'' } as input
*  Returns a multipart request object containing header and payload
*/

exports.multiPartFormDataRequestBuilder = (files = []) => {
    let boundary = "xxxxxxxxxx";
    let data = "";
    data += "--" + boundary + "\r\n";
    let payload = [];

    files.forEach(({
        upfile,
        content
    }, index) => {

        data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + upfile + "\"\r\n";
        data += "Content-Type:application/octet-stream\r\n\r\n";
        payload.push(
            Buffer.from(data, "utf8"),
            Buffer.from(JSON.stringify(content), 'binary')
        );

        if (index < files.length - 1) {
            payload.push(Buffer.from("\r\n--" + boundary + "\r\n", "utf8"))
        }

        data = ""

    })

    payload.push(Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"))

    payload = Buffer.concat(payload);

    return {
        headers: {
            "Content-Type": "multipart/form-data; boundary=" + boundary
        },
        payload
    }
}


/**
 * This functions check if the input is a valid JSON or not
 * Input: [String]
 * Output: [Boolean]
 */
exports.isValidJSON = (inputStr) => {
    try {
        const json = JSON.parse(inputStr);
        if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}