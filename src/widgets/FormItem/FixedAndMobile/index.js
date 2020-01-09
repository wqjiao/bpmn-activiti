/*
 * @Author: wqjiao
 * @Date: 2019-08-14 19:09:03
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-18 15:20:35
 * @Description: 固定电话与手机号码切换使用
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Input, Select, Form} from 'antd';
import {getFixedTelephone, getPhoneValue} from '@/utils/funcUtils';
import {FixedTelephoneRge, MobileReg} from '@/utils/constants';
import styles from './index.less';

const FormItem = Form.Item;

class FixedAndMobile extends PureComponent {
    static propTypes = {
        form: PropTypes.object,
        label: PropTypes.string,
        name: PropTypes.string,
        values: PropTypes.string,
        required: PropTypes.bool,
    };

    static defaultProps = {
        form: {},
        label: '',
        name: '',
        values: '',
        required: true,
    };

    state = {
        tabKey: 0, // 类型选项，默认固定电话
    };

    componentDidMount() {
        const {values} = this.props;

        // 判断初始号码是固话||手机
        if (values) {
            this.setState({
                tabKey: values.includes('-') ? 0 : 1,
            });
        }
    }

    componentDidUpdate() {
        const {
            name,
            form: {getFieldsValue},
        } = this.props;
        const {tabKey} = this.state;
        const values = getFieldsValue()[name];

        // 判断初始号码是固话||手机: value 存在大于 10 位且 tabKey 不相符，更新tabKey
        if (values && values.length > 11) {
            const newKey = values.includes('-') ? 0 : 1;

            if (newKey !== tabKey) {
                this.setState({
                    tabKey: newKey,
                });
            }
        }
    }

    // 切换类型选项
    handleChange = value => {
        const {
            form: {setFieldsValue},
            name,
        } = this.props;
        setFieldsValue({
            [name]: '',
        });
        this.setState({
            tabKey: value,
        });
    };

    render() {
        const {
            form: {getFieldDecorator},
            label,
            name,
            values,
            required,
        } = this.props;
        const {tabKey} = this.state;
        const tips = tabKey ? '手机号码' : '固定电话';

        return (
            <FormItem label={label} className={styles.fixedAndMobile}>
                <Select value={tabKey} onChange={this.handleChange}>
                    <Select.Option value={0}>固话</Select.Option>
                    <Select.Option value={1}>手机</Select.Option>
                </Select>
                {getFieldDecorator(name, {
                    initialValue: values || '',
                    rules: [
                        {
                            required: required,
                            whitespace: true,
                            message: `请输入${label}`,
                        },
                        {
                            pattern: new RegExp(tabKey ? MobileReg : FixedTelephoneRge, 'g'),
                            message: `请正确输入${label}`,
                        },
                    ],
                    getValueFromEvent: e => {
                        return tabKey ? getPhoneValue(e) : getFixedTelephone(e);
                    },
                })(<Input placeholder={`请输入${tips}`} />)}
            </FormItem>
        );
    }
}

export default FixedAndMobile;
