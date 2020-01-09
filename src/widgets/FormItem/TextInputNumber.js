/*
 * @Author: wqjiao
 * @Date: 2019-08-06 11:15:56
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-19 14:46:06
 * @Description: 文本与InputNumber组合
 */
import React, {PureComponent, Fragment} from 'react';
import {InputNumber} from 'antd';
import {limitDecimals} from '@/utils/funcUtils';

class TextInputNumber extends PureComponent {
    static getDerivedStateFromProps(nextProps) {
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
        };
    }

    /**
     * @method 修改 values 状态值
     * @description 修改 InputNumber 中的数值
     * @param [Number] type 对应 InputNumber
     */
    handleChange(type, value) {
        let values = this.state.values;

        values[type] = value;

        // 判断 Form 中是否存在 value
        if (!('value' in this.props)) {
            this.setState({values: values});
        }
        // this.setState({values: values});
        this.triggerChange(values);
    }

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;

        if (onChange) {
            onChange(changedValue);
        }
    };

    render() {
        let {
            data,
            validateType: {maxLength, limit, canEdit},
        } = this.props;
        let {values} = this.state;
        maxLength = maxLength || 10;
        limit = limit || [];

        return (
            <Fragment>
                {data.map(item => (
                    <span key={item.name + item.id} style={{marginRight: 10}}>
                        {item.title}
                        <InputNumber
                            key={item.name + item.id}
                            placeholder="请输入"
                            style={{marginLeft: 10}}
                            value={values[item.name]}
                            formatter={value => limitDecimals(value, maxLength)}
                            parser={value => limitDecimals(value, maxLength)}
                            onChange={this.handleChange.bind(this, item.name)}
                            disabled={!canEdit}
                            maxLength={maxLength}
                            min={limit[0] || 0}
                            max={limit[1] || 9999999.99}
                        />
                    </span>
                ))}
            </Fragment>
        );
    }
}

export default TextInputNumber;
