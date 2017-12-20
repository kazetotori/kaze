# `Kaze.js`



## `Introduce`
Kaze is an IOC factory that support simple apis for node.js.



<br><br><br>

-----
## `Simple start`
Set your project directory like this:
~~~
|- node_modules
     |- kaze
|- app.js
|- kaze.yml
~~~
#### app.js
~~~javascript
const Kaze = require('kaze');

(async function main(){
    let factory = await Kaze();
    let hello = factory.getInstance('hello');
    console.log(hello);
}())
~~~
#### kaze.yml
~~~yml
models:
    hello: hello world
~~~
#### Result
~~~
hello world
~~~



<br><br><br>

------
## `Version 1.0.0 apis`
- `function`
    - [Kaze(): Promise\<IFactory\>](#kazeFactory)
- `interface`
    - [IFactory](#IFactory)
    - [IConfigLoader](#IConfigLoader)
- `config`
    - config
    - models
        - value
        - ref
        - gen-type
        - type
        - class
        - properties


<br>

---
<span id="kazeFactory"></span>
### `Kaze(): Promise<IFactory>`
- The function to create kaze factory.
- This function returns a promise, so you need use it with await.
- For the factory apis, jump to [IFactory](#IFacotry)
~~~javascript
(async function(){
    let factory = await Kaze();
}())
~~~


<br>

---
<span id="IFactory"></span>
### `IFactory`
declare like this:
~~~typescript
declare interface IFactory {
    init(configLoader:IConfigLoader): Promise<void>
    getInstance(name: string): Promise<any>
}
~~~


# `TO BE CONTINUE...`

