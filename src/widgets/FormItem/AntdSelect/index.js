/*
 * @Author: wqjiao 
 * @Date: 2019-05-30 19:08:49 
 * @Last Modified by: qyy
 * @Last Modified time: 2019-11-29 14:44:09
 * @Description: AntdSelect 封装 antd 组件
 * @use:
 * <AntdSelect
        name='name' // 唯一表示 -- 必传
        data={userBy} // 下拉选项 -- 必传
        valueName='value' // value别名
        labelName='label' // label别名
        allowClear={true} // 支持清除
        showSearch={false} // 不支持搜索，默认支持
        placeholder='' // 选择框默认文字，默认请选择
        ... // 其他
    />
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';

const Option = Select.Option;

class AntdSelect extends PureComponent {
    static propTypes = {
        name: PropTypes.string,
        data: PropTypes.array,
        valueName: PropTypes.string,
        labelName: PropTypes.string,
    };

    static defaultProps = {
        name: '',
        data: [],
        valueName: 'value',
        labelName: 'label',
    };

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
            value: props.value,
        };
    }

    handleChange = value => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };

    render() {
        const {
            name,
            data = [],
            valueName,
            labelName,
            ...rest // allowClear showSearch...
        } = this.props;
        const {value} = this.state;

        return (
            <Select
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
                defaultValue={value}
                onChange={this.handleChange}
                {...rest}
            >
                {data.length > 0 &&
                    data.map(item => {
                        if (!item) return;
                        return (
                            <Option value={item[valueName]} key={`${name}-${item[valueName]}`}>
                                {item[labelName]}
                            </Option>
                        );
                    })}
            </Select>
        );
    }
}

export default AntdSelect;
