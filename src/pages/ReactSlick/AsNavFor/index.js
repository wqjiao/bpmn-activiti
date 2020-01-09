import React, {Component} from 'react';
import {Card, Icon, Row, Col} from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './index.less';
import '@/utils/c3ImgBrowser';

// 走马灯 prev/next 自定义按钮
function SlickArrow(props) {
    const {type, className, onClick} = props;

    return <Icon type={type} className={className} onClick={onClick} />;
}
import icon1 from '@/assets/icon-01.png';
import icon2 from '@/assets/icon-02.png';
import icon3 from '@/assets/icon-03.png';
import icon4 from '@/assets/icon-04.png';
// 测试数据
const data = [
    {
        id: '1',
        src: icon1,
    },
    {
        id: '2',
        src: icon2,
    },
    {
        id: '3',
        src: icon3,
    },
    {
        id: '4',
        src: icon4,
    },
    {
        id: '5',
        src: 'https://s3.amazonaws.com/static.neostack.com/img/react-slick/abstract04.jpg',
    },
];

export default class AsNavFor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav1: null,
            nav2: null,
            currentIndex: 0, // 当前激活的图片 index
        };
    }

    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2,
        });

        // 初始化 c3ImgBrowser 方法
        let currentImg = this.getNode();
        c3ImgBrowser(currentImg);
    }

    // 获取图片节点
    getNode = () => {
        const images = document.querySelectorAll(
            '.bpmn_activiti-pages-react-slick-as-nav-for-index-slicTrackImg img'
        );
        const node = images[this.state.currentIndex];
        return node;
    };

    componentWillUnmount() {
        let images = document.querySelectorAll(
            '.bpmn_activiti-pages-react-slick-as-nav-for-index-slicTrackImg img'
        );
        // NodeList
        if (images.length > 0) {
            [].forEach.call(images, function(item) {
                item && item.dispatchEvent(new CustomEvent('c3ImgBrowser.destroy'));
            });
        }
    }

    // 重置
    handleReaet = () => {
        const node = this.getNode();
        node && node.dispatchEvent(new CustomEvent('c3ImgBrowser.reset'));
    };

    // 放大
    handleZoomIn = () => {
        const node = this.getNode();
        node && node.dispatchEvent(new CustomEvent('c3ImgBrowser.zoomIn'));
    };

    // 缩小
    handleZoomOut = () => {
        const node = this.getNode();
        node && node.dispatchEvent(new CustomEvent('c3ImgBrowser.zoomOut'));
    };

    // 旋转
    handleRotate = () => {
        const node = this.getNode();
        node && node.dispatchEvent(new CustomEvent('c3ImgBrowser.rotate'));
    };

    render() {
        // 公共 settings
        const settings = {
            dots: false, // 面板指示点
            infinite: false, // 不循环
            slidesToScroll: 1,
            arrows: true, // 左右箭头
            prevArrow: <SlickArrow type="left" />,
            nextArrow: <SlickArrow type="right" />,
            afterChange: index => {
                let images = document.querySelectorAll(
                    '.bpmn_activiti-pages-react-slick-as-nav-for-index-slicTrackImg img'
                );
                let currentImg = images[index];

                this.setState({
                    currentIndex: index,
                });

                c3ImgBrowser(currentImg);
            },
            beforeChange: index => {
                let images = document.querySelectorAll(
                    '.bpmn_activiti-pages-react-slick-as-nav-for-index-slicTrackImg img'
                );
                let currentImg = images[index];

                currentImg && currentImg.dispatchEvent(new CustomEvent('c3ImgBrowser.destroy'));
            },
        };

        return (
            <Card className={styles.carousel}>
                {/* 详情及大图 */}
                <Slider
                    {...settings}
                    asNavFor={this.state.nav2}
                    ref={slider => (this.slider1 = slider)}
                    className={styles.carouselOne}
                >
                    {data.map(item => {
                        return (
                            <div key={item.id}>
                                <Row className={styles.slicTrackImg}>
                                    <Col span={12}>1212212</Col>
                                    <Col span={12}>
                                        <img src={item.src} alt="" />
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </Slider>

                {/* 操作按钮 */}
                <div className={styles.slickIcons}>
                    <Icon type="redo" title="重置" onClick={this.handleReaet} />
                    <Icon type="zoom-in" title="放大" onClick={this.handleZoomIn} />
                    <Icon type="zoom-out" title="缩小" onClick={this.handleZoomOut} />
                    <Icon type="undo" title="旋转" onClick={this.handleRotate} />
                </div>

                {/* 缩略图 */}
                <Slider
                    {...settings}
                    asNavFor={this.state.nav1}
                    ref={slider => (this.slider2 = slider)}
                    swipeToSlide={true}
                    focusOnSelect={true}
                    variableWidth={true}
                    className="slider variable-width"
                >
                    {data.map(item => {
                        return (
                            <div key={item.id}>
                                <img src={item.src} alt="" />
                            </div>
                        );
                    })}
                </Slider>
            </Card>
        );
    }
}
