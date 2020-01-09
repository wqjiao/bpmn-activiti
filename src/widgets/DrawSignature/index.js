/*
 * @Author: wqjiao
 * @Date: 2019-06-20 10:09:57
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-06-20 17:19:44
 * @Description: DrawSignature 绘制签名弹窗
 * @use: <DrawSignature callback={this.handleDraw} />
 */
import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, notification} from 'antd';
import Canvas from './Canvas';

export default class DrawSignature extends PureComponent {
    static propTypes = {
        callback: PropTypes.func, // 保存后的回调
    };

    state = {
        visible: false, // 绘制签名弹窗
    };

    // 显示弹窗
    handleSignature = () => {
        this.setState({
            visible: true,
        });
    };

    // 关闭弹窗
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 保存签名
    handleSave = base64 => {
        notification.success({
            message: '提示',
            description: '保存成功',
        });
        this.props.callback(base64);
        this.handleCancel(); // 关闭弹窗
    };

    render() {
        const {visible} = this.state;

        return (
            <Fragment>
                <Button type="primary" onClick={this.handleSignature}>
                    点击签名
                </Button>
                <Modal
                    visible={visible}
                    title="绘制签名"
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Canvas callback={this.handleSave} />
                </Modal>
            </Fragment>
        );
    }
}
