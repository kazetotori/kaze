/*
    Date: 2017-12-20
    Author: kazetotori/fxqn
    Description: Interface of kat core
*/


declare interface IConfigLoader {
    configPath: string
    init(): Promise<void>
    conf(name: string): Promise<string>
    model(name: string): Promise<any>
}

declare interface IFactory {
    init(configLoader:IConfigLoader): Promise<void>
    getInstance(name: string): Promise<any>
}

declare class Model {
    name: string
    value: any
    ref: string
    properties: Model[]
    type: Type
    'gen-type': GenType
    'class': string
}

declare enum GenType {
    static = 'static',
    new = 'new',
    refresh = 'refresh'
}

declare enum Type {
    array = 'array',
    class = 'class',
    factory = 'factory'
}