import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk';
import reducers from './index'

let DevToolsInstrument;

// 开发工具检测
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  DevToolsInstrument = window.__REDUX_DEVTOOLS_EXTENSION__();
}

export default () => {

  // thunkMiddleware做的事情就是判断 action 类型是否是函数，若是，则执行 action，若不是，则继续传递 action 到下个 middleware。
  const middleware = [thunkMiddleware];

  let finalCreateStore;
  // redux提供了applyMiddleware 这个 api 来加载 middleware
  // 借助 compose ， applyMiddleware 可以用来和其他插件一起加强 createStore 函数.
  if (DevToolsInstrument) {
    finalCreateStore = compose(applyMiddleware(...middleware), DevToolsInstrument)(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }

  // 将router组合进reducer
  const reducer = combineReducers({
    ...reducers
  });
  const store = finalCreateStore(reducer);

  return store;
}
