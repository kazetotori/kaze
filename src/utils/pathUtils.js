/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: The utils of path module
*/


const path = require('path')


/**
 * Get the filename without its extension.
 * aaa/bbb/ccc/ddd.txt  =>  aaa/bbb/ccc/ddd
 * @param {String} filename 
 * @return {String} 
 */
function noextensionName(filename) {
    let pathObj = path.parse(filename)
    return path.join(pathObj.dir, '/', pathObj.name)
}



/**
 * Get the extension with out the first "."
 * hello.txt  =>   txt
 * @param {String} filename 
 * @return {String}
 */
function extnameWithoutDot(filename) {
    return path.extname(filename).slice(1)
}





// out the module
module.exports.noextensionName = noextensionName
module.exports.extnameWithoutDot = extnameWithoutDot