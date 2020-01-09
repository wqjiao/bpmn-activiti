/*
 * @Author: wqjiao
 * @Date: 2019-12-17 15:05:51
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-17 17:29:04
 * @Description: 固定电话组件
 */
import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'antd';

// 处理传入的固定电话
function splitValue(value) {
    if (!value) return [];

    return value.split('-');
}

class FixedTelephone extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
    };

    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                values: splitValue(nextProps.value),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            values: splitValue(props.value),
        };
    }

    // 修改区号与电话值
    handleChange = (key, e) => {
        let values = this.state.values;
        let value = e.target.value;

        if (!/[0-9]$/.test(value)) {
            value = value.replace(/[^0-9]/g, '');
        }
        values[key] = value;

        const onChange = this.props.onChange;
        if (onChange) {
            if (values[0] === undefined || !(values[0] + '')) {
                values.splice(0, 1, '');
            }
            if (values[1] === undefined || !(values[1] + '')) {
                values.splice(1, 1, '');
            }
            if (!(values[0] + '') && !(values[1] + '')) {
                values = [];
            }

            onChange(values.join('-'));
        }
    };

    render() {
        const {disabled, length = 8} = this.props;
        const {values} = this.state;

        return (
            <Fragment>
                <Input
                    placeholder="请输入"
                    style={{width: '70px'}}
                    value={values[0]}
                    onChange={this.handleChange.bind(this, 0)}
                    maxLength={4}
                    disabled={disabled}
                />
                <span style={{display: 'inline-block', width: '20px', textAlign: 'center'}}>-</span>
                <Input
                    placeholder="请输入"
                    style={{width: 'calc(100% - 92px)'}}
                    value={values[1]}
                    onChange={this.handleChange.bind(this, 1)}
                    maxLength={length}
                    disabled={disabled}
                />
            </Fragment>
        );
    }
}

export default FixedTelephone;
