/*
 * @Author: wqjiao
 * @Date: 2019-03-31 19:33:48
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-04-22 10:38:35
 * @Description: DoubleNumber 双数字输入框
 */
import React, {Fragment} from 'react';
import {InputNumber} from 'antd';

export default class DoubleNumber extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            values: props.value || [],
            limit: props.limit || [],
        };
    }

    /**
     * @method 修改 values 状态值
     * @description 修改 InputNumber 中的数值
     * @param [Number] type 对应 InputNumber
     */
    handleChange(type, value) {
        let values = this.state.values;
        values[type] = this.checkNumberEvent(value);
        // console.log(type, value, values)
        // 判断 Form 中是否存在 value
        if (!('value' in this.props)) {
            this.setState({values: values});
        }
        this.triggerChange(values);
    }

    /**
     * @method 数字及小数点校验，非数字小数点置空
     * @description 把 onChange 的参数（如 event）转化为控件的值
     * @param [*] value 用户输入的值
     */
    checkNumberEvent = value => {
        value = value + '';

        if (!/^\d?$/.test(value)) {
            value = value.replace(/[^0-9]/g, '');
        }

        return value ? parseFloat(value) : '';
    };

    // 获取数字输入框数据
    getInputNumber = value => {
        const reg = /^(\d+)*$/;
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1') : '';
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1') : '';
        } else {
            return '';
        }
    };

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
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
        const {values, limit} = this.state;
        const min = limit.length > 0 ? limit[0] : undefined,
            max = limit.length === 2 ? limit[1] : undefined;

        return (
            <Fragment>
                <InputNumber
                    placeholder="请输入"
                    style={{width: 'calc(50% - 12px)'}}
                    value={values[0]}
                    onChange={this.handleChange.bind(this, 0)}
                    formatter={this.getInputNumber}
                    parser={this.getInputNumber}
                    min={min}
                    max={max}
                />
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>-</span>
                <InputNumber
                    placeholder="请输入"
                    style={{width: 'calc(50% - 12px)'}}
                    value={values[1]}
                    onChange={this.handleChange.bind(this, 1)}
                    formatter={this.getInputNumber}
                    parser={this.getInputNumber}
                    min={min}
                    max={max}
                />
            </Fragment>
        );
    }
}
