/*
 * @Author: wqjiao
 * @Date: 2019-06-20 10:09:57
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-06-20 17:27:28
 * @Description: Canvas 绘制签名
 */
import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'antd';
import Draw from './draw';
import styles from './Canvas.less';

export default class Canvas extends PureComponent {
    static propTypes = {
        callback: PropTypes.func, // 保存签名的回调函数
    };

    componentDidMount() {
        Draw.init(this.refs['canvas-wrap']);
    }

    // 重置功能
    handleReset() {
        Draw.clear();
    }

    // 导出功能
    handleSave = () => {
        let exportImg = Draw.exportImg();

        if (exportImg === -1) {
            Modal.info({
                title: '提示',
                content: '请绘制签名!',
            });
            return;
        }
        this.props.callback(exportImg); // 绘制签名回调
    };

    render() {
        return (
            <Fragment>
                {/* Canvas */}
                <div className={styles.canvasWrap} ref="canvas-wrap" />
                {/* Button */}
                <div className={styles.buttonWrap}>
                    <Button onClick={this.handleReset}>重置</Button>
                    <Button type="primary" onClick={this.handleSave}>
                        保存
                    </Button>
                </div>
            </Fragment>
        );
    }
}
