/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: The utils to raad yaml file.
*/


const fsUtils = require('./fsUtils')
const yaml = require('js-yaml')


/**
 * Read yaml to generate an object or array and return from the specific path.
 * @param {String} path
 * @return {Promise<Object|Array>} The object or array generated according to the yaml file
 */
async function readYamlAsync(path) {
    let txt = await fsUtils.readFileAsync(path, 'utf8')
    return yaml.safeLoad(txt)
}





// out the module
module.exports.readYamlAsync = readYamlAsync