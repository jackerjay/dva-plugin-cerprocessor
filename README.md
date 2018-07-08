## dva-plugin-cerprocessor 

#### `dva-plugin-cerprocessor` 能做什么  

`dva-plugin-cerprocessor`是`dva`的一个插件，用来处理统一的请求`effect`和`reducer`。当前插件只能用于使用`REST API`的请求接口使用；

#### 如何使用  
在`dva`的入口文件中，使用 
```index.js
// 引入dva-plugin-cerprocessor
import {createCerprocessor, cerprocessorModel} from 'dva-plugin-cerprocessor'; 

const app = dva();

// 使用插件
app.use(createCerprocessor({effects: true}));

...

app.model(cerprocessorModel);

```  
在`dva`的`model`中，这样使用：
```
import ...
// 引入定义好的 dispatch_type
import { DISPATCH_TYPE } from 'dva-plugin-cerprocessor';
// 导入你需要的异步网络请求
import { YOUR_ASYNC_REQUEST } from 'YOUR_ASYNC_REQUEST_FILE';

export default {
  namespace: 'app',
  effects: {
    * sampleEffect({payload}, {put}) {
      yield put({
        type: DISPATCH_TYPE,
        payload,
        callFunction: YOUR_ASYNC_REQUEST, // 需要请求的异步网络请求
        namespace: 'app', // 当前的namespace名称
        config: {
          data: 'data',
          code: 200,
          successCallback: (data) => {
            // YOUR CALLBACK FUNCTION
            // 请求成功的回掉函数，可以处理一些通知和跳转
          },
          failCallback: (data) => {
            // YOUR CALLBACK FUNCTION
            // 请求失败的回调函数，可以处理一些通知或跳转
          },
          key: '' // STATE KEY WHAT YOU WANT NAMED
        }
      })
    }
  },
  reducers: {
    ...
  }
}
```

#### 开源协议  
![](https://camo.githubusercontent.com/d0d002b0bfba052685aac76992b55d1e357a5685/68747470733a2f2f6f70656e736f757263652e6f72672f66696c65732f6f73695f6b6579686f6c655f333030583330305f39307070695f302e706e67) [MIT](https://opensource.org/licenses/MIT)