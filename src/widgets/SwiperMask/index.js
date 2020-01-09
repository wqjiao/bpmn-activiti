import React from 'react';

import Swiper from 'swiper/js/swiper.js';
import 'swiper/css/swiper.min.css';
import {Select, Button, Modal} from 'antd';
const {Option} = Select;

import {isImageFile} from '@/utils/funcUtils';
import styles from './index.less';

/**
 * @description 图片轮播工具
 * @author bge
 * @date 2019-11-07
 * @class SwiperWrapper
 * @extends {React.Component}
 */
class SwiperWrapper extends React.Component {
    // 初始化数据，应该是从外组件传入
    state = {
        show: false,
        currentType: '',
        fileList: [],
        selects: [],
        index: 0,
    };

    constructor(props) {
        super(props);
        let selectPics = [];

        // 如果设置了默认类型，需要选择并筛选数据
        if (props.currentType) {
            selectPics = props.fileList.filter(function(item) {
                return item.type === props.currentType;
            });
        } else {
            selectPics = props.fileList;
        }
        // 更新state
        this.state = {
            ...props,
            fileList: selectPics,
        };
    }

    // UNSAFE_componentWillReceiveProps(props) {
    //     let me = this;
    //     let selectPics = [];

    //     // 如果设置了默认类型，需要选择并筛选数据
    //     if (props.currentType) {
    //         selectPics = props.fileList.filter(function(item) {
    //             return item.type === props.currentType;
    //         });
    //     } else {
    //         selectPics = props.fileList;
    //     }
    //     // 更新state
    //     me.setState({
    //         ...props,
    //         fileList: selectPics,
    //     });

    //     // 隔500毫秒之后更新swiper组件
    //     setTimeout(function() {
    //         me.initSwiper(props.index);
    //     }, 500);
    // }

    componentDidMount() {
        // 隔500毫秒之后更新swiper组件
        setTimeout(() => {
            this.initSwiper(this.props.index);
        }, 500);
    }

    /**
     * @description 初始化和重新渲染swiper
     * @author bge
     * @date 2019-11-07
     * @memberof SwiperWrapper
     */
    initSwiper(index) {
        let swiperThumbs = new Swiper('.swiper-thumbs', {
            // initialSlide: index,
            spaceBetween: 10,
            slidesPerView: 7,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        });

        let swiperMain = new Swiper('.swiper-main', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // initialSlide: index,
            allowTouchMove: false,
            spaceBetween: 10,
            thumbs: {
                swiper: swiperThumbs,
            },
            on: {
                slideChange: function() {
                    let $container = document.querySelectorAll('.swiper-main .swiper-slide img')[
                        this.activeIndex
                    ];
                    $container && $container.dispatchEvent(new CustomEvent('c3ImgBrowser.reset'));
                },
            },
        });

        // 手动触发切换功能
        if (index) {
            swiperMain.slideTo(index);
            swiperThumbs.slideTo(index);
        }

        // 重新初始化旋转缩小
        window.c3ImgBrowser &&
            window.c3ImgBrowser(document.querySelectorAll('.swiper-main .swiper-slide img'), {
                fobiddenWheel: true,
            });
    }

    /**
     * @description 渲染轮播图的内容
     * @author bge
     * @date 2019-11-07
     * @returns
     * @memberof SwiperWrapper
     */
    renderSwiperSlide() {
        let list = [];
        this.state.fileList.forEach(function(item) {
            list = list.concat(item.fileList);
        });

        list = list.map(function(item, index) {
            if (isImageFile(item.url)) {
                return (
                    <div className="swiper-slide" key={index}>
                        <img src={item.url} alt="" />
                    </div>
                );
            } else {
                return null;
            }
        });
        return list;
    }

    /**
     * @description 渲染select的options
     * @author bge
     * @date 2019-11-07
     * @returns
     * @memberof SwiperWrapper
     */
    renderSelect() {
        let list = this.props.fileList.map(function(item, index) {
            const files = JSON.parse(JSON.stringify(item.fileList)).filter(i => isImageFile(i.url));
            if (files.length !== 0) {
                // if (item.fileList.length !== 0 ) {
                return (
                    <Option value={item.type} key={index}>
                        {item.type}
                    </Option>
                );
            }
        });
        if (list.length > 1) {
            list.unshift(
                <Option key="" value="">
                    全部
                </Option>
            );
        }

        return list;
    }

    /**
     * @description 切换类型，并更新swiper内容
     * @memberof SwiperWrapper
     */
    handleSelectChange = e => {
        let selectPics = [];
        if (e) {
            selectPics = this.props.fileList.filter(function(item) {
                return item.type === e;
            });
        } else {
            selectPics = this.props.fileList;
        }
        // 重置当前图片
        this.handleReset();
        this.setState(
            {
                currentType: e,
                fileList: selectPics,
            },
            function() {
                this.initSwiper(0);
            }
        );
    };

    // 旋转
    handleRotate = () => {
        let $currentImg = document.querySelector('.swiper-main .swiper-slide-active img');
        $currentImg.dispatchEvent(new CustomEvent('c3ImgBrowser.rotate'));
    };
    // 重置
    handleReset = () => {
        let $currentImg = document.querySelector('.swiper-main .swiper-slide-active img');
        $currentImg.dispatchEvent(new CustomEvent('c3ImgBrowser.reset'));
    };
    //  TODO 销毁全部
    handleDestroyAll = () => {
        let $imgs = document.querySelectorAll('.swiper-main img');
        let imgs = [].slice.call($imgs);
        imgs.forEach(function(item) {
            item.dispatchEvent(new CustomEvent('c3ImgBrowser.destroy'));
        });
    };
    // 旋转
    handleScale = scale => {
        let $currentImg = document.querySelector('.swiper-main .swiper-slide-active img');
        $currentImg.dispatchEvent(new CustomEvent('c3ImgBrowser.scale', {detail: {scale: scale}}));
    };

    // 对话框控制
    handleOk = () => {
        this.props.handlePreview(false);
    };
    handleCancel = () => {
        this.props.handlePreview(false);
    };

    render() {
        let mainSwiperSlides = this.renderSwiperSlide();
        let thumbsSwiperSlides = this.renderSwiperSlide();
        let select = this.renderSelect();

        return (
            <Modal
                title=""
                visible={this.state.show}
                onOk={this.handleOk}
                okText="确定"
                className={styles.swiperMask}
                onCancel={this.handleCancel}
                footer={null}
                width={`100%`}
                style={{
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                <div className={styles.mainContainer}>
                    {this.props.children}
                    <div className="swiper-container swiper-main">
                        <div className="swiper-wrapper">{mainSwiperSlides}</div>
                        <div className="swiper-button-next" />
                        <div className="swiper-button-prev" />
                    </div>
                </div>

                <div className={styles.thumbsContainer}>
                    <Select
                        className={styles.typeSelect}
                        value={this.state.currentType}
                        onChange={this.handleSelectChange}
                    >
                        {select}
                    </Select>

                    <div className={styles.toolButtons}>
                        <Button shape="round" onClick={this.handleReset}>
                            重置
                        </Button>
                        <Button
                            shape="round"
                            icon="zoom-in"
                            onClick={this.handleScale.bind(this, 1)}
                        />
                        <Button
                            shape="round"
                            icon="zoom-out"
                            onClick={this.handleScale.bind(this, -1)}
                        />
                        <Button shape="round" icon="reload" onClick={this.handleRotate} />
                    </div>

                    <div className="swiper-container swiper-thumbs">
                        <div className="swiper-wrapper" style={{userSelect: 'none'}}>
                            {thumbsSwiperSlides}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

SwiperWrapper.defaultProps = {
    show: false,
    fileList: [],
    selects: [],
    currentType: '',
};

export default SwiperWrapper;
