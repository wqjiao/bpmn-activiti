/*
 * @Author: wqjiao
 * @Date: 2019-03-31 19:33:48
 * @Last Modified by: qyy
 * @Last Modified time: 2019-12-19 18:14:15
 * @Description: FloatDoubleNumber 双浮点数字输入框(允许输入两位小数)
 */
import React, {Fragment} from 'react';
import {InputNumber} from 'antd';

class FloatDoubleNumber extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || [],
            limit: props.limit || [],
        };
    }

    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                value: nextProps.value || [],
            };
        }
        return null;
    }

    /**
     * @method 修改区间值
     * @param {Number}} index 当前修改的value索引
     * @param {String} value 最新值
     */
    handleChange(index, value) {
        let values = this.state.value;

        values[index] = value;

        this.triggerChange(values);
    }

    // 获取数字输入框数据
    getInputNumber = value => {
        const reg = /^(\d+)\.(\d\d).*$/;

        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1.$2') : '';
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1.$2') : '';
        } else {
            return '';
        }
    };

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const {onChange} = this.props;
        if (onChange) {
            if (changedValue[0] === undefined || !(changedValue[0] + '')) {
                changedValue.splice(0, 1, '');
            }
            if (changedValue[1] === undefined || !(changedValue[1] + '')) {
                changedValue.splice(1, 1);
            }
            if (!(changedValue[0] + '') && !(changedValue[1] + '')) {
                changedValue = [];
            }

            onChange(changedValue); // [1] || ['', 1]
        }
    };

    render() {
        const {value, limit} = this.state;
        let options = {};

        if (limit.length > 0) {
            options = {
                min: limit[0] || limit[0] === 0 ? limit[0] : undefined,
                max: limit[1] || undefined,
            };
        }

        return (
            <Fragment>
                <InputNumber
                    placeholder="请输入"
                    style={{width: 'calc(50% - 12px)'}}
                    value={value[0]}
                    onChange={this.handleChange.bind(this, 0)}
                    formatter={this.getInputNumber}
                    parser={this.getInputNumber}
                    {...options}
                />
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>-</span>
                <InputNumber
                    placeholder="请输入"
                    style={{width: 'calc(50% - 12px)'}}
                    value={value[1]}
                    onChange={this.handleChange.bind(this, 1)}
                    formatter={this.getInputNumber}
                    parser={this.getInputNumber}
                    {...options}
                />
            </Fragment>
        );
    }
}

export default FloatDoubleNumber;
