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
    console.log(this.props)
  }

  componentWillUnmount() {
    /* 组件从DOM中移除时调用 */
  }

  render() {
    const { homeStore } = this.props; // redux store
    console.log(homeStore)
    return (
      <div className={styles.content}>
        home <br />
      </div>
    );
  }
}

export default Home;
