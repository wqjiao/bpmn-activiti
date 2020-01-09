/*
 * @Author: wqjiao
 * @Date: 2019-11-21 19:54:15
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-09 12:51:44
 * @Description: 日期选择器(配置长期) -> 证件截止日期
 */
import React, {PureComponent, Fragment} from 'react';
import {DatePicker, Checkbox} from 'antd';
import moment from 'moment';

class LongTermPicker extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }

    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                value: nextProps.value || '',
            };
        }
        return null;
    }

    // 修改截止日期
    handleChange = value => {
        this.triggerChange(value);
    };

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        const onChange = this.props.onChange;

        if (onChange) {
            onChange(changedValue);
        }
    };

    // 切换长期选项
    handleCheckbox = e => {
        let value = e.target.checked ? moment('9999-12-31', 'YYYY-MM-DD') : '';

        this.triggerChange(value);
    };

    render() {
        const {disabled = false, disabledDate = () => {}} = this.props;
        const {value} = this.state;
        const checkBox = value ? value.format('YYYY-MM-DD') === '9999-12-31' : false;

        return (
            <Fragment>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={value || null}
                    placeholder="请选择"
                    style={{width: 'calc(100% - 68px)', marginRight: '8px'}}
                    onChange={this.handleChange}
                    disabled={disabled || checkBox}
                    disabledDate={disabledDate}
                />
                <Checkbox onChange={this.handleCheckbox} checked={checkBox}>
                    长期
                </Checkbox>
            </Fragment>
        );
    }
}

export default LongTermPicker;
