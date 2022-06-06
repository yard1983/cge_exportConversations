const crypto = require('crypto')
const fetch = require('node-fetch')
const tokenSources = require('../constants/tokenSources');
const algorithm = 'aes-256-cbc'
const key = Buffer.from('907ffc8efdd5c7bf241a9ce64c3f2c1211acff32e8880338f3cccadaaa4a92c4', 'hex')
const iv = Buffer.from('31a05bab5c66a2a3fea7eecfffe92b2d', 'hex')

const fetchWrapper = async (url, init) => {
    const response = await fetch(url, init) 
    const json = await response.json()
    return response.ok ? json : Promise.reject(json)
}

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted.toString('hex')
}

const decrypt = (text) => {
    let encryptedText = Buffer.from(text, 'hex')
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

const sendResponse = (responseCode, responseBody) => {
    const response = {
        statusCode: responseCode,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers
        },
        body: JSON.stringify(responseBody)
    }
    console.log(`Sending response: ${JSON.stringify(response)}`)
    return response
}

const isRequestHeadersValid = (event, requiredHeaders) => {
    if (!event.headers) {
        return { valid: false, message: 'Request headers not provided' }
    }
    const headers = event.headers;

    for (const header of requiredHeaders) {
        if (!headers.hasOwnProperty(header)) {
            return { valid: false, message: `invalid request headers, '${header}' missing` }
        }
    }

    if (headers.tokensource) {
        switch (headers.tokensource.toLowerCase()) {
            case tokenSources.purecloud:
                if (!headers.env) {
                    return { valid: false, message: "invalid request headers, 'env' missing" }
                }
                break
            case tokenSources.cognito:
                if (!headers.userpoolid) {
                    return { valid: false, message: "invalid request headers, 'userpoolid' missing" }
                }
                break
            default:
                return { valid: false, message: "invalid request headers, unsupported value for 'tokensource'" }
        }
    }
    return { valid: true }
}

const isRequestBodyValid = (event, requiredProperties) => {
    if (!event.body) {
        return { valid: false, message: 'Request body not provided' }
    }

    let body;
    try {
        console.log('Attempting to parse event.body')
        body = JSON.parse(event.body)
    } catch (error) {
        console.log(error);
        console.log('event:', event);
        return { valid: false, message: `Could not parse body` }
    }

    for (const property of requiredProperties) {
        if (!body.hasOwnProperty(property)) {
            return { valid: false, message: `invalid request body, '${property}' missing` }
        }
    }

    return { valid: true, body }
}

const removeDuplicatesBy = (keyFn, array) => {
    var mySet = new Set();
    return array.filter(function (x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const isIterable = (value) => {
    return Symbol.iterator in Object(value);
}

module.exports = {
    fetchWrapper,
    sendResponse,
    isRequestHeadersValid,
    isRequestBodyValid,
    removeDuplicatesBy,
    sleep,
    isIterable,
    encrypt,
    decrypt
}