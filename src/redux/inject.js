// base lib
import { Map } from 'core-js'; // IE 10以下不支持Map
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { allReducer as allStates, allActions } from './index';

/**
 * key: action
 * value: bindDispatch(action)
 * @type {Map}
 */

const actionsCache = new Map();

/**
 * 根据data创建 mapState 和 mapActions
 * @param data 比如：baseStates, allStates, baseActions, allActions
 * @param src 比如 mapState方法传入的state对象或者mapAction中传入的dispatch对象
 * @param type 'state' , 'action'
 * @returns {{}}
 * 逻辑：
 * 根据data中的键值对，创建相应的mapState和mapActions
 *
 * 根据下面的例子改写
 * const mapState = (state)=>{
 *  return {
 *      app:state.root.app,
 *      user:state.root.user,
 *  }
 * };
 *
 * const mapDispatch = (dispatch)=>{
 *  return {
 *      appActions: bindActionCreators(appActions,dispatch),
 *  }
 * };
 */
function creatRedux(data, src, type) {
  const res = {};
  for (let i in data) { // eslint-disable-line
    if (data.hasOwnProperty(i)) { // eslint-disable-line
      if (type === 'state') {
        res[i] = src[i];
      } else {
        if (!actionsCache.has(data[i])) {
          actionsCache.set(data[i], bindActionCreators(data[i], src));
        }
        res[i] = actionsCache.get(data[i]);
      }
    }
  }
  return res;
}

// 过滤处理state和action
function filterRedux(allsrc, filterReg) {
  const res = {};
  let resIsEmpty = true;
  for (let i in allsrc) { // eslint-disable-line
    if (allsrc.hasOwnProperty(i) && filterReg.test(i)) { // eslint-disable-line
      res[i] = allsrc[i];
      resIsEmpty = false;
    }
  }
  if (!resIsEmpty) {
    return res;
  }
  return null;
}

const createMap = (allSrc, type, reg, componentName = '', fr = filterRedux, cr = creatRedux) => stateDispatch => {
  const userNeeds = fr(allSrc, reg);
  if (!userNeeds) {
    console.warn(`${componentName} component没有找到可绑定的 ${type}`);
    return {};
  }
  return cr(userNeeds, stateDispatch, type);
};

/**
 * 往组件中注入state和action
 * @param options 支持多个参数
 * 'app', 'user', ...
 */
export default function createInject(...arg) {
  const options = arg ? [...arg] : false;
  return function Inject(component) {
    if (!options) {
      return component;
    }
    const componentName = component.name;

    const filterReg = new RegExp(options.join('|'), 'i');

    const mapState = createMap(allStates, 'state', filterReg, componentName);
    const mapDispatch = createMap(allActions, 'action', filterReg, componentName);

    return connect(mapState, mapDispatch, null, { withRef: true })(component);
  };
}

