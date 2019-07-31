import { showLoading, hideLoading, showToast } from '@common/utils';
import EnhanceAxios from '@common/utils/enhanceAxios';
import requestHandler from '@common/utils/requestHandler';

const { host } = process.env;

const Axios = EnhanceAxios({ baseURL: host, beforeSend: () => { } });

const request = (options) => {
  const { method, url, data, isShowLoading = true } = options;

  let requestFun = () => false;

  if (isShowLoading) {
    showLoading();
    requestFun = requestHandler.subscribe(url, +new Date())
  }

  const requestData = JSON.stringify(data)
  console.log('入参--->')
  console.log(requestData)

  return Axios({
    url,
    method: method || 'post',
    data: requestData
  })
    .then(res => {
      // 统一增加后端接口前置判断条件
      if (res.responseCode === '000000') {
        console.log('出参--->')
        console.log(res.responseData)
        return Promise.resolve(res.responseData)
      }
      return Promise.reject(res)
    })
    .catch(err => {
      showToast(err.responseMessage || '系统繁忙，请稍后再试');
      return Promise.reject(err);
    })
    .finally(() => {
      requestFun();
      if (JSON.stringify(requestHandler.requestRecord) === "{}") {
        hideLoading();
      }
    })
}

export default request
