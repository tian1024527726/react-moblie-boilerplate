// 导入 reducer
import appStore from '@/app/reducer'
/* reducer End */

// 导入 action
import * as appAction from '@/app/action'
/* action End */

/**
 * 通过require.context方法获取pages下antions.js和reducer.js文件
 * 通过yarn create:page 创建页面时会动态生成antions.js和reducer.js文件
 */
const getClientReduxContext = () => {
  const actionsContext = require.context('../pages', true, /action\.js$/);
  const reducerContext = require.context('../pages', true, /reducer\.js$/);
  return {
    actionsContext,
    reducerContext,
  };
};

const { actionsContext, reducerContext } = getClientReduxContext();

/**
 * 根据文件路径生成导入的模块名称
 * @param path
 */
const reg = /\/\w/g;
const formatModuleName = path => {
  // 去除./和.js字符
  let moduleName = path.replace(/\.\/|\.js/g, '');

  const matchArr = moduleName.match(reg);
  matchArr.forEach(mi => {
    const upperChar = mi.substr(1).toUpperCase();
    moduleName = moduleName.replace(mi, upperChar);
  });
  // 首字母小写
  moduleName = moduleName.charAt(0).toLowerCase() + moduleName.substr(1);
  // 将Reducer改为Store方便开发理解含义
  moduleName = moduleName.replace('Reducer', 'Store');
  return moduleName;
};

const getRedux = context => {
  const obj = {};
  context.keys().forEach(item => {
    const moduleName = formatModuleName(item);
    obj[moduleName] = context(item);
  });
  return obj;
};

const pageActions = getRedux(actionsContext);
const pageReducer = getRedux(reducerContext);


// 将actions 加入自动导入对象
export const allActions = {
  appAction,
  ...pageActions,
};

// 将reducer 加入自动注入对象
export const allReducer = {
  appStore,
  ...pageReducer,
};



export default allReducer;
