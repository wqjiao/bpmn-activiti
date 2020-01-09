/*
 * @Author: wqjiao
 * @Date: 2019-04-26 10:13:19
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-04-26 13:40:18
 * @Description: FixedTelephone 固定电话
 */
import React from 'react';
import {Row, Col, Input} from 'antd';

export default class FixedTelephone extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || ''),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        const {value} = props;
        const index = value.indexOf('-');

        this.state = {
            before: index !== -1 ? value.substring(0, index) : '',
            after: index !== -1 ? value.substring(index + 1) : '',
        };
    }

    getFixedTelephone(e, isBefore) {
        let value = e.target.value;

        // before
        if (isBefore && !/^0\d{2,3}$/.test(value)) {
            value = value.replace(/[^0-9]/g, '');
        }
        // after
        if (!isBefore && !/^\d{7,8}$/.test(value)) {
            value = value.replace(/[^0-9]/g, '');
        }

        return value;
    }

    // 修改 before - Input 中的内容
    handleBeforeChange = e => {
        const value = this.getFixedTelephone(e, true);
        this.setState({
            before: value,
        });
        this.triggerChange(`${value}-${this.state.after}`);
    };

    // 修改 after - Input 中的内容
    handleAfterChange = e => {
        const value = this.getFixedTelephone(e, false);
        this.setState({
            after: value,
        });
        this.triggerChange(`${this.state.before}-${value}`);
    };

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    };

    render() {
        const {before, after} = this.state;

        return (
            <Row style={{width: '100%', display: 'flex'}} compact>
                <Col span={10}>
                    <Input
                        type="text"
                        value={before}
                        style={{width: 'calc(100% - 18px)'}}
                        placeholder="请输入"
                        onChange={this.handleBeforeChange}
                        min={3}
                        max={4}
                        maxLength={4}
                    />
                    <span style={{display: 'inline-block', width: '18px', textAlign: 'center'}}>
                        -
                    </span>
                </Col>
                <Col span={14}>
                    <Input
                        type="text"
                        value={after}
                        style={{width: '100%'}}
                        placeholder="请输入"
                        onChange={this.handleAfterChange}
                        min={7}
                        max={8}
                        maxLength={8}
                    />
                </Col>
            </Row>
        );
    }
}
