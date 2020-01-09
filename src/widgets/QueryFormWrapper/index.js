import React, {PureComponent, Fragment} from 'react';
import {Button, Row, Col, Form, Icon} from 'antd';
/**
 * @description 查询区域封装，其他表单只需要作为children传入即可。
 */
class QueryFormWrapper extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: props.expandForm || false, // 切换展开/收起
        };
    }
    /**
     * 重置操作
     */
    handleFormReset = () => {
        const {form, handleFormReset} = this.props;
        form.resetFields();
        handleFormReset();
    };

    /**
     * 查询操作
     */
    handleSearch = e => {
        e.preventDefault();
        const {form, handleSearch} = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleSearch(fieldsValue);
        });
    };

    // 切换 Form 展开/收起
    toggleForm = () => {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    render() {
        const childrenWithProps = React.Children.toArray(this.props.children);
        const childrenLength = childrenWithProps.length;
        const {expandForm} = this.state;
        const {isShow = true} = this.props; // 是否显示(展开/收起)

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                {/* 默认收起 -- 显示展开文案 */}
                {!expandForm ? (
                    <Row gutter={{md: 8, lg: 24, xl: 48}}>
                        {childrenLength > 1
                            ? this.props.children.map((item, index) => {
                                  return index < 2 ? item : null;
                              })
                            : this.props.children}
                        {/* 通过children的数量控制Button的位置 */}
                        <Col md={8} sm={24} style={{marginBottom: '24px'}}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                                重置
                            </Button>
                            {childrenLength > 2 && (
                                <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                                    展开 <Icon type="down" />
                                </a>
                            )}
                        </Col>
                    </Row>
                ) : (
                    <Fragment>
                        <Row gutter={{md: 8, lg: 24, xl: 48}}>
                            {this.props.children}
                            {/* 通过children的数量控制Button的位置 */}
                            {childrenLength % 3 > 0 && (
                                <Col md={8} sm={24} style={{marginBottom: '24px'}}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                                        重置
                                    </Button>
                                    {isShow && (
                                        <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                                            收起 <Icon type="up" />
                                        </a>
                                    )}
                                </Col>
                            )}
                        </Row>
                        {/* 传入表单是3的倍数 */}
                        {!(childrenLength % 3) && (
                            <Row type="flex" justify="end">
                                <Col style={{marginBottom: '24px'}}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                                        重置
                                    </Button>
                                    {isShow && (
                                        <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                                            收起 <Icon type="up" />
                                        </a>
                                    )}
                                </Col>
                            </Row>
                        )}
                    </Fragment>
                )}
            </Form>
        );
    }
}

export default QueryFormWrapper;
