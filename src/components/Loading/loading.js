import React from 'react';
import Toast from 'yzt-rui/lib/toast';

/* eslint-disable */
const LoadingIcon = (
  <div className='Loading'>
    <div className='Loading-content'></div>
    {/* 全屏阴影 */}
    <div className='Loading-mask'></div>
  </div>
)

class Loading extends React.Component {

  static show = () => {
    Toast.show(LoadingIcon, 1000)
    document.body.style.overflow = 'hidden';
  }

  static hide = () => {
    Toast.hide()
    document.body.style.overflow = '';
  }
}

export default Loading
