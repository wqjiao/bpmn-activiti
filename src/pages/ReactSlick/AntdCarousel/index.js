import React, {Component} from 'react';
import {Card, Icon, Carousel} from 'antd';
import styles from './index.less';

// 走马灯 prev/next 自定义按钮
function SlickArrow(props) {
    const {type, className, onClick} = props;

    return <Icon type={type} className={className} onClick={onClick} />;
}

// 测试数据
const data = [
    {
        id: '1',
        src: 'https://assets.che300.com/feimg/incoming/icon-05.png',
    },
    {
        id: '2',
        src: 'https://assets.che300.com/feimg/incoming/icon-02.png',
    },
    {
        id: '3',
        src: 'https://assets.che300.com/feimg/incoming/icon-03.png',
    },
    {
        id: '4',
        src: 'https://assets.che300.com/feimg/incoming/icon-04.png',
    },
    {
        id: '5',
        src: 'https://s3.amazonaws.com/static.neostack.com/img/react-slick/abstract04.jpg',
    },
];

class AntdCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav1: null,
            nav2: null,
        };
    }

    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2,
        });
    }

    render() {
        // 公共set
        const settings = {
            dots: false, // 面板指示点
            infinite: false, // 不循环
            slidesToScroll: 1,
            arrows: true, // 左右箭头
            prevArrow: <SlickArrow type="left" />,
            nextArrow: <SlickArrow type="right" />,
        };

        return (
            <Card className={styles.carousel}>
                <Carousel
                    {...settings}
                    asNavFor={this.state.nav2}
                    ref={slider => (this.slider1 = slider)}
                    className={styles.carouselOne}
                >
                    {data.map(item => {
                        return (
                            <div key={item.id}>
                                <img src={item.src} alt="" />
                            </div>
                        );
                    })}
                </Carousel>
                <Carousel
                    {...settings}
                    asNavFor={this.state.nav1}
                    ref={slider => (this.slider2 = slider)}
                    variableWidth={true}
                    swipeToSlide={true}
                    focusOnSelect={true}
                    className="slider variable-width"
                >
                    {data.map(item => {
                        return (
                            <div key={item.id}>
                                <img src={item.src} alt="" />
                            </div>
                        );
                    })}
                </Carousel>
            </Card>
        );
    }
}

export default AntdCarousel;
