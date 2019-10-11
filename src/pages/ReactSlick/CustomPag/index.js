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

class CustomPag extends Component {
    render() {
        const settings = {
            customPaging: function(i) {
                return <img src={data[i].src} />;
            },
            dotsClass: 'slick-dots slick-thumb',
            arrows: true, // 左右箭头
            prevArrow: <SlickArrow type="left" />,
            nextArrow: <SlickArrow type="right" />,
            className: styles.customPag,
        };

        return (
            <Card bordered={false} className={styles.carousel}>
                <Carousel {...settings}>
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

export default CustomPag;
