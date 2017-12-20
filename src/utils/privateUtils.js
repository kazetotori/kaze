/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: This module will manage the class object's private data
*/


// symbol key
var $id = Symbol('id')
// cache data
var cache = {}



/**
 * Store the object to cache space. And set the id for the object.
 * @param {Object} obj 
 */
function store(obj) {
    let id = Symbol('kaze-private-utils')
    obj[$id] = id
    cache[id] = {}
}


/**
 * Get private value of an object
 * @param {Object} obj 
 * @param {String} key 
 */
function get(obj, key) {
    let data = getAll(obj)
    return data[key]
}


/**
 * Set private value for an object
 * @param {Object} obj 
 * @param {String} key 
 * @param {any} value 
 */
function set(obj, key, value) {
    let data = getAll(obj)
    data[key] = value
}


/**
 * Get all private key/values of an object.
 * @param {Object} obj 
 * @return {any}
 */
function getAll(obj) {
    let id = obj[$id]
    let data = cache[id]
    return data
}




// out the module
module.exports.store = store
module.exports.get = get
module.exports.set = set
module.exports.getAll = getAll