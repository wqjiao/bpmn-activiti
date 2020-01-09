/*
 * @Author: wqjiao
 * @Date: 2019-08-30 11:44:14
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-21 17:20:43
 * @Description: 时间轴List
 * @use <TimelineList
 *  className={} // css 类名
 *  isPack={false} // 使用展开/收起，默认不使用
 * isExpand={false} // 全部信息展开/收起，默认收起(isPack 为 true)
 * >{children}</TimelineList>
 */
import React, {Component, Fragment} from 'react';
import {Icon} from 'antd';
import AntdEmpty from '@/widgets/AntdEmpty';
import styles from './index.less';

class TimelineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpand: props.isExpand || false, // 默认超过两条隐藏
        };
    }

    // 点击展示全部
    showAllLine = () => {
        this.setState({
            isExpand: !this.state.isExpand,
        });
    };

    render() {
        const {isExpand} = this.state;
        const {className, isPack = false, children, ...restProps} = this.props;
        const childrenWithProps = React.Children.toArray(children);
        const childrenLength = childrenWithProps.length;

        if (childrenLength === 0) {
            return <AntdEmpty />;
        }
        const hasLine = isPack && childrenLength > 2 && !isExpand;
        // 展示子元素
        const RenderTimelineList = () => {
            return (
                <Fragment>
                    {React.Children.map(children, (child, index) => {
                        const childItem = React.cloneElement(child, {hasLine});

                        if (isExpand) {
                            return child ? childItem : child;
                        }
                        return child && index < 2 ? childItem : null;
                    })}
                </Fragment>
            );
        };
        // 展开||收起
        const ShowBtn = () => {
            return (
                <div className={styles.hideTimeLine} onClick={this.showAllLine}>
                    {isExpand ? (
                        <a className={styles.btnReadmore}>
                            收起 <Icon style={{transform: 'rotate(90deg)'}} type="double-left" />
                        </a>
                    ) : (
                        <a className={styles.btnReadmore}>
                            查看全部{' '}
                            <Icon style={{transform: 'rotate(-90deg)'}} type="double-left" />
                        </a>
                    )}
                </div>
            );
        };

        return (
            <div className={styles.timelineList}>
                <ul className={className} {...restProps}>
                    {/* 默认隐藏 & 大于两条数据 */}
                    {isPack && childrenLength > 2 ? (
                        <RenderTimelineList />
                    ) : (
                        React.Children.map(children, child =>
                            child ? React.cloneElement(child, {hasLine}) : child
                        )
                    )}
                </ul>
                {isPack && childrenLength > 2 && <ShowBtn />}
            </div>
        );
    }
}

export default TimelineList;
