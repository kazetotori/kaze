/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: The core factory of kaze that generate all the instanfces.
*/

/// .d.ts ///
/// <reference path="../declare/kaze.d.ts"/>

/// import ///
const path = require('path')
const yamlUtils = require('./../utils/yamlUtils')
const pathUtils = require('./../utils/pathUtils')
const privateUtils = require('./../utils/privateUtils')


/// define module variables ///
var kazeRoot
var defaultConfigPath
var defaultConfig
var defaultConfigLoaderConstructor


/// module init promise ///
var initModule = (async function _initModule() {

    // read default config from "kazeRoot/config/kaze.default.yml"
    kazeRoot = path.join(__dirname, './../')
    defaultConfigPath = path.join(kazeRoot, './config/kaze.default.yml')
    defaultConfig = await yamlUtils.readYamlAsync(defaultConfigPath)

    // read the default config loader as "core/YamlConfigLoader.ConfigLoader"
    let loaderPath = path.join(kazeRoot, '/', pathUtils.noextensionName(defaultConfig['config-loader-class']))
    let loaderName = pathUtils.extnameWithoutDot(defaultConfig['config-loader-class'])

    let loaderModule = require(loaderPath)
    defaultConfigLoaderConstructor = loaderName === '' ? loaderModule : loaderModule[loaderName]
}())








/// core code ///

/**
 * The core factory of kaze that generate all the instanfces.
 */
class Factory {
    // constructor
    constructor(initModels = false) {
        privateUtils.store(this)
        privateUtils.set(this, 'initModels', initModels)
    }



    // @Override
    /**
     * Init the factory
     * @param {IConfigLoader} configLoader
     */
    async init(configLoader) {
        await initModule
        let loader = new defaultConfigLoaderConstructor()
        let initLoader = loader.init()
        privateUtils.set(this, 'configLoader', loader)
        privateUtils.set(this, 'staticInstances', {})
        privateUtils.set(this, 'refreshInstances', {})
        await initLoader
    }



    // @Override
    /**
     * Get instance according to the configured name.
     * @param {String} name The model name.
     * @return {any}
     */
    async getInstance(name) {
        let loader = privateUtils.get(this, 'configLoader')
        let model = await loader.model(name)
        return await generate.call(this, model)
    }
}






/**
 * According to the model, generate the instance.
 * @param {Model} model 
 */
async function generate(model) {
    // if model is not an object or it's null, return the model directly.
    if (!(model instanceof Object) || model === null) {
        return model
    }

    // if has value, directly return the value
    if ('value' in model) {
        return model['value']
    }

    // if has ref, directly return the ref object
    if ('ref' in model) {
        return await this.getInstance(model['ref'])
    }

    // return according to the gen-type
    let genType = model['gen-type']
    switch (genType) {
        case 'new':
            return await newInstance.call(this, model)
            break;
        case 'static':
            return await staticInstance.apply(this, model)
            break;
        case 'refresh':
            return await this.refreshInstance(model)

            // no any gen-type configured, return model itself
        default:
            return model;
    }
}




/**
 * According to the model, create a new instance and return.
 * @param {Model} model 
 */
async function newInstance(model) {
    let instance = await initInstance.call(this, model)
    return await finalizeInstance.apply(this, [model, instance])
}




/**
 * Get the named static instance. If the instance is not inited, init the instance according to the model
 * @param {Model} model 
 */
async function staticInstance(model) {
    let staticInstances = privateUtils.get(this, 'staticInstances')
    let name = model['name']
    // if the instance has already inited, return the instance.
    if (name in staticInstances) {
        return staticInstances[name]
    } else {
        // init the instance, put it into the staticInstances and return
        let instance = newInstance.call(this, model)
        staticInstances[name] = instance
        return instance
    }
}




/**
 * Get the named static instance. If the instance is not inited, init the instance according to the model
 * @param {Model} model 
 */
async function refreshInstance(model) {
    let refreshInstances = privateUtils.get(this, 'refreshInstances')
    let name = model['name']
    if (name in refreshInstances) {
        // refinalize the instance and return
        return finalizeInstance.apply(this, [model, refreshInstances[name]])
    } else {
        let instance = newInstance.call(this, model)
        refreshInstances[name] = instance
        return instance
    }
}




/**
 * According to the model, init an instance and return.
 * @param {Model} model 
 */
async function initInstance(model) {
    // define instance
    let instance
    let type = model['type']
    let configLoader = privateUtils.get(this, 'configLoader')

    if (type === 'array') {
        instance = []
    } else if ('class' in model) {
        // read project root path
        let root = await configLoader.conf('root')
        // read class as string "aaa/bbb/ccc.XXX"
        let _class = model['class']
        let classPath = path.join(root, '/', pathUtils.noextensionName(_class))
        let className = pathUtils.extnameWithoutDot(_class)
        let classModule = require(classPath)
        let _constructor = className === '' ? classModule : classModule[className]
        // return the created instance
        if (type === 'class') {
            instance = new _constructor()
        } else {
            // default as a factory
            instance = _constructor()
        }
    } else {
        // no any type or class configured, return an empty object.
        instance = {}
    }

    return instance
}




/**
 * According to the model, finalize the instance.
 * @param {Model} model 
 * @param {Object} instance
 */
async function finalizeInstance(model, instance) {

    // get the properties
    let properties = model['properties']

    // if no properties configured, directly return instance
    if (!Array.isArray(properties)) {
        return instance
    }

    // iterate properties
    for (let i = 0; i < properties.length; i++) {
        let prop = properties[i]
        let propName = prop['name']
        let propValue = await generate.call(this, prop)
        instance[propName] = propValue
    }

    return instance
}



/**
 * The function to build kaze factory.
 * @param {IConfigLoader} configLoader
 * @return {IFactory} 
 */
async function Kaze(configLoader) {

    let kaze = new Factory()
    try {
        await kaze.init(configLoader)
    } catch (e) {
        console.log(e)
    }
    return kaze
}







// out the module
module.exports = Kaze