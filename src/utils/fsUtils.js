/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: The utils of fs module
*/


const fs = require('fs')


/**
 * The async function of fs.readFile
 * @param {String} path
 * @param {String} encoding default as utf8
 * @return {Promise<Buffer|String>} data
 */
async function readFileAsync(path, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    });
}





// out the module
module.exports.readFileAsync = readFileAsync