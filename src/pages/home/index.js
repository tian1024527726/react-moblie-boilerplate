// 这是自动生成的文件，可以修改。

import React, { Component } from 'react';
import inject from '@inject';
import styles from './style.module.scss';

@inject('home')
class Home extends Component {

  componentDidMount() {
    /* 初始化渲染执行之后调用,仅执行一次 */
    const { homeAction: { getUserInfo } } = this.props;
    getUserInfo()
  }

  componentWillUnmount() {
    /* 组件从DOM中移除时调用 */
  }

  createExle = () => {
    // 下载的表格模板数据
    const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">

<head>
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
       <x:Name>Sheet1</x:Name>
       <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
       </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head>

<body>
  <table cellspacing="0" border="1">
    <tr rowspan=3>
      <td colspan=6 rowspan=3>
        <p style='text-align: center;font-size: 18px'>
          IRM我的命中订单
        </p>
        <span style='display: flex ; align-items: center ;color: blue'>
          <span style='font-size: 11px ; display: inline-block '>以下信息都由甲方经信息主体授权获得</span>
          <span style='flex: 1; display:  inline-block ;'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</span>
        </span>
      </td>
    </tr>

    <tr>
      <td>序号</td>
      <td>姓名</td>
      <td>证件类型</td>
      <td>手机号</td>
      <td>信息主体授权码</td>
      <td>固话号</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
  </table>
</body>

</html>

    `;

    const blob = new Blob([template], {type: 'application/vnd.ms-excel'});
    const createObjectURL = (object) => { return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object); }
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, 'sheet.xlsx');

    } else {
      const a = document.createElement('a');
      const urlBlob = createObjectURL(blob);
      a.href = urlBlob;
      a.download = 'sheet.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(urlBlob);
    }
  }

  render() {
    const { homeStore } = this.props; // redux store
    console.log(homeStore)
    return (
      <div className={styles.content}>
        home <br />
        <button type='button' onClick={this.createExle}>导出exle</button>
      </div>
    );
  }
}

export default Home;
