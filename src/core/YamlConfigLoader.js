/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: The default config loader for kat.
*/


/// .d.ts ///
/// <reference path="../declare/kaze.d.ts"/>

/// import ///
const path = require('path')
const yamlUtils = require('./../utils/yamlUtils')
const privateUtils = require('./../utils/privateUtils')






/// core code ///

class YamlConfigLoader {

    /**
     * Constructor. The argument configPath is supported for the loader to find the config file
     * The default config path is in the "process.cwd()/kaze.yml"
     * @param {String} configPath 
     */
    constructor(configPath) {
        privateUtils.store(this)
        configPath = configPath || path.join(process.cwd(), './kaze.yml')
        privateUtils.set(this, 'configPath', configPath)
    }



    // @Override
    /**
     * Get the config path of the yaml config loader.
     */
    get configPath() {
        return privateUtils.get(this, 'configPath')
    }



    // @Override
    /**
     * Init the config loader. Read ymal config
     */
    async init() {
        let config = await yamlUtils.readYamlAsync(this.configPath)
        config = config || {}
        config.config = config.config || {}
        config.models = config.models || {}
        privateUtils.set(this, 'config', config)
        let root = config.config.root = await this.conf('root') || process.cwd()
        let includes = await config['includes']

        if (Array.isArray(includes)) {
            for (let i = 0; i < includes.length; i++) {
                let includePath = path.join(root, '/', includes[i])
                let localConfig = await yamlUtils.readYamlAsync(includePath)
                Object.assign(config.config, localConfig.config || {})
                Object.assign(config.models, localConfig.models || {})
            }
        }
    }


    // @Override
    /**
     * According to the name, get the configured value
     * @param {String} name 
     * @return {String}
     */
    async conf(name) {
        let config = privateUtils.get(this, 'config')
        return config['config'][name]
    }


    // @Override
    /**
     * According to the name, get the configured model
     * @param {String} name 
     * @return {any}
     */
    async model(name) {
        let config = privateUtils.get(this, 'config')
        return config['models'][name]
    }
}







// out the module
module.exports = YamlConfigLoader