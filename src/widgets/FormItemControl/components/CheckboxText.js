/*
 * @Author: wqjiao
 * @Date: 2019-03-31 19:33:48
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-04-03 11:41:57
 * @Description: CheckboxText 复选框 + Input
 */
import React from 'react';
import {Row, Col, Checkbox, Input} from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class CheckboxText extends React.Component {
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
            checkboxText: props.value || [],
        };
    }

    // 修改 Checkbox 类型
    handleCheckedChange = checkeds => {
        let {checkboxText} = this.state;

        checkboxText =
            checkboxText.length > 0 &&
            checkboxText.map(item => {
                let checked = false;
                checkeds.map(value => {
                    if (item.value === value) checked = true;
                });

                return {
                    ...item,
                    checked,
                    text: checked ? item.text : '',
                };
            });

        this.setState({checkboxText});
        this.triggerChange(checkboxText);
    };

    // 修改 Input 中的内容
    handleTextChange(value, e) {
        let {checkboxText} = this.state;

        checkboxText =
            checkboxText.length > 0 &&
            checkboxText.map(item => {
                if (item.value === value) {
                    item = {
                        ...item,
                        // checked: e.target.value ? true : false,
                        text: e.target.value,
                    };
                }
                return item;
            });

        this.setState({checkboxText});
        this.triggerChange(checkboxText);
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
        const {
            state: {checkboxText},
            props: {name},
        } = this;
        let checkeds = [];

        for (let i = 0; i < checkboxText.length; i++) {
            if (checkboxText[i].checked) {
                checkeds.push(checkboxText[i].value);
            }
        }

        return (
            <CheckboxGroup
                style={{width: '100%'}}
                onChange={this.handleCheckedChange}
                value={checkeds}
            >
                <Row gutter={{md: 8, lg: 15, xl: 24}}>
                    {checkboxText.length > 0 &&
                        checkboxText.map(item => {
                            return (
                                <Col
                                    key={`${name}-${item.value}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                    }}
                                    xl={8}
                                    md={12}
                                    sm={24}
                                >
                                    <Checkbox value={item.value} style={{verticalAlign: 'middle'}}>
                                        {item.label}
                                    </Checkbox>
                                    <Input
                                        type="text"
                                        value={item.text}
                                        style={{flex: '1'}}
                                        placeholder="请输入"
                                        onChange={this.handleTextChange.bind(this, item.value)}
                                    />
                                </Col>
                            );
                        })}
                </Row>
            </CheckboxGroup>
        );
    }
}
