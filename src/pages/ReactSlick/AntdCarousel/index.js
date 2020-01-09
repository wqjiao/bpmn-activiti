import React, {Component} from 'react';
import {Card, Icon, Carousel} from 'antd';
import styles from './index.less';

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
