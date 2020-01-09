/*
 * @Author: wqjiao
 * @Date: 2019-08-30 11:43:57
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-16 14:37:38
 * @Description: 时间轴子项
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';

const TimelineItem = ({
    time,
    children,
    leftStyle = {},
    rightStyle = {},
    hasLine = false,
    ...restProps
}) => (
    <li className={styles.timelineItem} {...restProps}>
        <div className={styles.timelineLeft} style={leftStyle}>
            {time}
        </div>
        <div className={classNames(styles.timelineMiddle, {[styles.noLine]: !hasLine})}>
            <div className={styles.timelineTail} />
            <div className={classNames(styles.timelineHead, styles.blue)} />
        </div>
        {children !== null && children !== undefined && (
            <div className={styles.timelineRight} style={rightStyle}>
                {children}
            </div>
        )}
    </li>
);

TimelineItem.defaultProps = {
    time: '',
};

TimelineItem.propTypes = {
    time: PropTypes.node,
};

export default TimelineItem;
