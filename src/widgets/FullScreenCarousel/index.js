/*
 * @Author: zhuxingmin
 * @Date: 2019-11-11 16:01:59
 * @Last Modified by: zhuxingmin
 * @Last Modified time: 2019-12-17 19:08:47
 */
import React, {PureComponent} from 'react';
// import {connect} from 'dva';
import {Modal, Icon, Carousel, Button} from 'antd';
import styles from './index.less';

/* eslint react/no-multi-comp:0 */
// @connect(({}) => ({}))
// @Form.create()

/**
 * 全屏展示carousel组件
 * @param data // 数据
 * @param startIndex // carousel起始展示下标
 */

// 轮播图 prev/next 自定义按钮
//  https://github.com/akiran/react-slick/issues/1130
function SlickArrow(props) {
    const {type, className, onClick} = props;

    return <Icon type={type} className={className} onClick={onClick} />;
}

class FullScreenCarousel extends PureComponent {
    state = {
        data: [],
        visible: false,
        startIndex: 0,
        num: 8,
    };

    componentDidMount() {
        this.setState({
            ...this.props,
        });

        this.rotate = 0;
        this.scale = 1;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.visible !== prevState.visible) {
            return {
                ...nextProps,
            };
        }
        return null;
    }

    goTo = (index, dontAnimate = false) => {
        this.carousel.goTo(index, dontAnimate);
    };

    slideTo = type => {
        // this.carousel[type]()
        const {data} = this.state;
        let startIndex = this.state.startIndex;
        let len = data.length - 1;
        switch (type) {
            case 'prev':
                startIndex == 0 ? this.goTo(len, false) : this.goTo(--startIndex);
                break;
            case 'next':
                startIndex == len ? this.goTo(0, false) : this.goTo(++startIndex);
                break;
        }

        // this.goTo(startIndex)
    };

    afterChange = current => {
        this.setState({
            startIndex: current,
        });
    };

    beforeChange = (from, to) => {
        this.dotCarousel.goTo(to);
    };

    operateBtn = type => {
        const ele = document.querySelectorAll('.slick-active.slick-current')[0];

        switch (type) {
            case 'reset':
                this.scale = 1;
                this.rotate = 0;
                break;
            case 'in':
                this.scale *= 1.1;
                break;
            case 'out':
                this.scale *= 0.9;
                break;
            case 'rotate':
                this.rotate += 90;
                break;
        }
        ele.style.transform = `scale(${this.scale}) rotate(${this.rotate}deg)`;
    };

    concatData = data => {
        const {num} = this.state;
        let x = num - data.length;
        let arr = [];
        if (x > 0) {
            arr = [...new Array(x)].map(() => ({}));
        }
        data = data.concat(arr);
        return data;
    };

    render() {
        const {visible, data = [], startIndex} = this.state;

        let _data = this.concatData(data);

        return (
            <Modal
                visible={visible}
                onOk={this.onOk}
                onCancel={this.props.onCancel}
                zIndex={1100}
                footer={null}
                width={`100%`}
                style={{
                    overflow: 'hidden',
                    height: '100%',
                }}
                wrapClassName={styles.fullModal}
                destroyOnClose={true}
            >
                <div className={styles.container}>
                    <div className={styles.toolbtns}>
                        <Button onClick={() => this.operateBtn('reset')}>重置</Button>
                        <Button
                            onClick={() => this.operateBtn('in')}
                            title="放大"
                            className={styles.icon}
                        >
                            <Icon type="zoom-in" />
                        </Button>
                        <Button
                            onClick={() => this.operateBtn('out')}
                            className={styles.icon}
                            title="缩小"
                        >
                            <Icon type="zoom-out" />
                        </Button>
                        <Button
                            onClick={() => this.operateBtn('rotate')}
                            className={styles.icon}
                            title="旋转"
                        >
                            <Icon type="reload" />
                        </Button>
                    </div>
                    <div className={styles.content}>
                        <SlickArrow
                            className={styles.arrow}
                            type="left"
                            onClick={() => this.slideTo('prev')}
                        />
                        <div style={{width: '90%'}}>
                            <Carousel
                                ref={node => (this.carousel = node)}
                                // arrows={true}
                                initialSlide={startIndex}
                                // prevArrow={<SlickArrow className={styles.arrow} type="left" />}
                                // nextArrow={<SlickArrow className={styles.arrow} type="right" />}
                                afterChange={this.afterChange}
                                beforeChange={this.beforeChange}
                                dots={false}
                                // effect={`fade`}
                                // appendDots={() => (
                                //     <div className={styles.dotBox}>
                                //         <Icon
                                //             onClick={() => this.slideTo('prev')}
                                //             className={styles.dotArrorw}
                                //             style={{color: '#fff'}}
                                //             type="left"
                                //         />
                                //         <ul className={styles.dotUl}>
                                //             {data.map((item, index) => (
                                //                 <li
                                //                     className={[
                                //                         styles.dotimgbox,
                                //                         startIndex == index ? styles.active : '',
                                //                     ].join(' ')}
                                //                     key={index}
                                //                     onClick={() => this.goTo(index)}
                                //                 >
                                //                     <img
                                //                         className={styles.dotimg}
                                //                         src={item.path}
                                //                         alt=""
                                //                     />
                                //                 </li>
                                //             ))}
                                //         </ul>
                                //         <Icon
                                //             onClick={() => this.slideTo('next')}
                                //             className={styles.dotArrorw}
                                //             style={{color: '#fff'}}
                                //             type="right"
                                //         />
                                //     </div>
                                // )}
                            >
                                {_data.map((item, index) => (
                                    <div className={styles.imgbox} key={index}>
                                        <div className={styles.center}>
                                            <img className={styles.img} src={item.path} alt="" />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <SlickArrow
                            className={styles.arrow}
                            type="right"
                            onClick={() => this.slideTo('next')}
                        />
                    </div>
                </div>
                <div className={styles.bottomCarousel}>
                    <SlickArrow
                        className={styles.arrow}
                        type="left"
                        onClick={() => this.slideTo('prev')}
                    />
                    <div style={{width: '90%'}}>
                        <Carousel
                            // asNavFor={this.carousel}
                            ref={node => (this.dotCarousel = node)}
                            // arrows={true}
                            initialSlide={startIndex}
                            // prevArrow={<SlickArrow className={styles.arrow} type="left" />}
                            // nextArrow={<SlickArrow className={styles.arrow} type="right" />}
                            dots={false}
                            slidesPerRow={1} // 一屏几个元素 例 8  一屏8个 一次滚动更新8个元素
                            slidesToScroll={1} // 一次滚动几屏
                            slidesToShow={8} // 一屏8个 一次滚动更新1个元素
                            className="dot"
                            // beforeChange={this.beforeChange}
                        >
                            {_data.map((item, index) => (
                                <div
                                    className={[
                                        styles.imgbox,
                                        startIndex == index ? styles.active : '',
                                    ].join(' ')}
                                    key={index}
                                    onClick={() => this.goTo(index)}
                                >
                                    <div className={styles.center}>
                                        <img className={styles.img} src={item.path} alt="" />
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <SlickArrow
                        className={styles.arrow}
                        type="right"
                        onClick={() => this.slideTo('next')}
                    />
                </div>
            </Modal>
        );
    }
}

export default FullScreenCarousel;
