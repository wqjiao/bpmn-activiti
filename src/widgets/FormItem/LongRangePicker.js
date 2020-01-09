/*
 * @Author: wqjiao
 * @Date: 2019-11-21 19:53:54
 * @Last Modified by: qyy
 * @Last Modified time: 2019-12-23 09:51:17
 * @Description: 区间选择器(配置长期) -> 证件有效期
 */
import React, {Component, Fragment} from 'react';
import {DatePicker, Checkbox} from 'antd';
import moment from 'moment';

class LongRangePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || [],
            endOpen: false, // 结束日期选择面板是否自动展示
        };
    }

    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value || [];

            return {
                value: nextProps.value || [],
                checkBox: value[1] ? value[1].format('YYYY-MM-DD') === '9999-12-31' : false,
            };
        }
        return null;
    }

    // 起始日期禁选设置
    disabledStartDate = startValue => {
        return startValue && startValue > moment().endOf('day');
    };

    // 结束日期禁选设置
    disabledEndDate = endValue => {
        let {value} = this.state;
        if (value[0]) {
            return (
                endValue &&
                (endValue < moment().endOf('day') || endValue < moment(value[0]).add(1, 'months'))
            );
        } else {
            return endValue && endValue < moment().endOf('day');
        }
    };

    // 起始日期选择面板的开启设置
    handleStartOpenChange = open => {
        if (!open) {
            this.setState({endOpen: true});
        }
        if (this.state.checkBox) {
            this.setState({
                endOpen: false,
            });
        }
    };

    // 结束日期选择面板的开启设置
    handleEndOpenChange = open => {
        this.setState({endOpen: open});

        if (this.state.checkBox) {
            this.setState({
                endOpen: false,
            });
        }
    };

    /**
     * @method 选择起始/结束日期
     * @param {Number}} index 当前修改的value索引
     * @param {*} value 选中的日期
     */
    handleChange(index, value) {
        let values = this.state.value;

        values[index] = value || undefined;
        this.triggerChange(values);
    }

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            if (changedValue[0] === undefined) {
                changedValue.splice(0, 1, '');
            }
            if (changedValue[1] === undefined) {
                changedValue.splice(1, 1);
            }
            if (!changedValue[0] && !changedValue[1]) {
                changedValue = [];
            }

            onChange(changedValue);
        }
    };

    // 切换长期选项
    handleCheckbox = e => {
        let {value} = this.state;

        value[1] = e.target.checked ? moment('9999-12-31', 'YYYY-MM-DD') : '';
        this.triggerChange(value);
    };

    render() {
        const {disabled = false} = this.props;
        const {value, endOpen, checkBox} = this.state;

        let _disabled = checkBox || disabled ? true : false;

        return (
            <Fragment>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    format="YYYY-MM-DD"
                    value={value[0] ? value[0] : null}
                    placeholder="开始时间"
                    style={{width: 'calc(50% - 50px)'}}
                    onChange={this.handleChange.bind(this, 0)}
                    onOpenChange={this.handleStartOpenChange}
                    showTime={false}
                    disabled={disabled}
                />
                <span style={{display: 'inline-block', width: '20px', textAlign: 'center'}}>-</span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    format="YYYY-MM-DD"
                    value={value[1] ? value[1] : null}
                    placeholder="结束时间"
                    style={{width: 'calc(50% - 50px)'}}
                    onChange={this.handleChange.bind(this, 1)}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    disabled={_disabled}
                />
                <Checkbox
                    style={{paddingLeft: '10px'}}
                    onChange={this.handleCheckbox}
                    checked={checkBox}
                    disabled={disabled}
                >
                    长期
                </Checkbox>
            </Fragment>
        );
    }
}

export default LongRangePicker;
