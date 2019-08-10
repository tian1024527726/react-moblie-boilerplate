import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class BannerSlide extends React.Component {

  static defaultProps = {
    autoplay: null,
    slideLoop: null,
    pagination: true,
    dataList: []
  }

  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { slideLoop, dataList, autoplay } = this.props;
    const loopStatus = slideLoop == null ? true : slideLoop;
    const autoplayStatus = autoplay == null ? {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
      disableOnInteraction: false
    } : autoplay;
    import('swiper')
      .then(Swiper => {
        this.bannerSwiper = new Swiper('.BannerSlide', {
          loop: loopStatus,
          observer: true,
          observeParents: true,
          pagination: {
            el: '.swiper-pagination',
          },
          autoplay: autoplayStatus
        })
        this.bannerWrapper.addEventListener('click', (e) => {
          const dataIndex = e.target.getAttribute('data-img-index');
          /*通过代理事件,获取参数，执行click函数*/
          dataList[dataIndex] && dataList[dataIndex].onClick && dataList[dataIndex].onClick();
        })
      })
  }
  componentWillUnmount() { }

  renderSlide = () => {
    const { dataList } = this.props;
    return (
      <div className="swiper-wrapper">
        {dataList.map((item, index) => {
          return (
            <div key={index} className="swiper-slide">
              {
                item.img && <img src={item.img} data-img-index={index} />
              }
              {
                item.content
              }
            </div>
          )
        })}
      </div>
    )
  }
  renderPagination() {
    const { pagination } = this.props;
    if (!pagination) {
      return null
    }
    return (
      <div className="swiper-pagination"></div>
    )
  }
  render() {
    const { dataList, className } = this.props;
    const BannerSlide = classNames('BannerSlide', 'swiper-container', className);
    if (dataList.length == 0) {
      return null
    }
    return (
      <div className={BannerSlide} ref={node => this.bannerWrapper = node}>
        {this.renderSlide()}
        {this.renderPagination()}
      </div >
    )
  }
}

BannerSlide.propTypes = {
  className: PropTypes.string,
  slideLoop: PropTypes.bool,
  pagination: PropTypes.bool,
  dataList: PropTypes.array
}

export default BannerSlide;
