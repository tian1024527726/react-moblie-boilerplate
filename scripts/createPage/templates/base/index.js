// 这是自动生成的文件，可以修改。
import React, { Component } from 'react';
import inject from '@inject';
import styles from './style.module.scss';

@inject('$template$')
class $Template$ extends Component {

  componentDidMount() {
    /* 初始化渲染执行之后调用,仅执行一次 */
    const { $templateFullName$Action: { getUserInfo }, $templateFullName$Store } = this.props;
    getUserInfo()
      .then(() => {
        console.log($templateFullName$Store)
      })
  }

  componentWillUnmount() {
    /* 组件从DOM中移除时调用 */
  }

  render() {
    return (
      <div className={styles.content}>
        $template$
      </div>
    );
  }
}

export default $Template$;
