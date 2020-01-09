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
        src: '',
    },
    {
        id: '2',
        src: icon1,
    },
    {
        id: '3',
        src: icon2,
    },
    {
        id: '4',
        src: icon3,
    },
    {
        id: '5',
        src: icon4,
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
