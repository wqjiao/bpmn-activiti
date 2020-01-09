import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {Tabs} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
/**
 * @description 左侧tab切换。
 */
class LeftBar extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        scrollH: true,
    };

    // 获取高度限制
    getLimitHeight() {
        const tabBar = document.getElementsByClassName('forceyu-widgets-left-bar-index-tabsBox')[0];

        if (tabBar) {
            const clientRect = tabBar.childNodes[0].getBoundingClientRect();
            const clientHeight = document.documentElement.clientHeight - 120; // 可视区域高度

            if (clientHeight - clientRect.height <= 0) {
                return clientHeight - 10;
            }
        }

        return 'auto';
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollFunction, true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollFunction, true);
    }

    // 监听滚动事件执行状况
    scrollFunction = () => {
        const topContant = document.getElementsByClassName(
            'forceyu-widgets-left-bar-index-topContant'
        )[0];
        const topHeight = topContant ? topContant.getBoundingClientRect().height + 180 : 140;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 屏幕滚动距离

        if (scrollTop > topHeight && this.state.scrollH === true) {
            this.setState({
                scrollH: false,
            });
        } else if (scrollTop < topHeight && this.state.scrollH === false) {
            this.setState({
                scrollH: true,
            });
        }
    };

    render() {
        const {title, topContant = '', bottomContant = ''} = this.props;
        return (
            <PageHeaderWrapper title={title}>
                {/* Tabs 上方内容 */}
                {topContant && <div className={styles.topContant}>{topContant}</div>}
                {/* Tabs */}
                <Tabs
                    tabPosition="left"
                    className={classNames(styles.tabsBox, {
                        [styles.fixed]: !this.state.scrollH,
                    })}
                    style={{minHeight: this.getLimitHeight() + 10}}
                    onChange={this.props.onChange}
                    tabBarStyle={{height: this.getLimitHeight()}} // 高度限制
                >
                    {this.props.children}
                </Tabs>
                {/* Tabs 下方内容 */}
                {bottomContant}
            </PageHeaderWrapper>
        );
    }
}

export default LeftBar;
