/**
 * author yyb
 * 此页面作为'父'页面，其他页面作为其'子'面页，通过this.props.children展示，在此页面可做一些全局控制处理
 */

import { Component } from 'react'
import Inject from '../redux/inject';
import './index.scss'

@Inject('app')
class App extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillReceiveProps() { }

  componentWillUnmount() { }

  render() {
    const { children } = this.props;
    return children
  }
}

export default App;
