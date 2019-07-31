// 这是自动生成的文件，可以修改。
import userService from '@/service/user';
import * as types from './constant';

/* eslint no-unused-vars:0 */
const getUserInfo = (params = {}) => async dispatch => {
  return userService.getUserInfo({
    data: params.data
  })
    .then(res => {
      dispatch({
        type: types.SAVE_USER_INFO,
        payload: res
      })
    })
}

export default {
  getUserInfo
};
