/*
 * @Author: wqjiao
 * @Date: 2019-08-23 11:11:27
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 18:13:55
 * @Description: 基础设置 -> 流程管理 -> 新增/编辑流程
 */
import React, {PureComponent} from 'react';
import {Modal, Form, Input} from 'antd';
import AntdSelect from '@/widgets/AntdSelect';

const FormItem = Form.Item;
const {TextArea} = Input;

@Form.create()
class ProcessModal extends PureComponent {
    state = {
        enabled: [], // 启用状态
    };

    componentDidMount() {
        const {dispatch} = this.props;

        dispatch({
            type: 'processManage/getPageUseDict',
            payload: {
                codes: 'enabled,process_type',
            },
            callback: data => {
                this.setState({
                    enabled: data.enabled,
                    process_type: data.process_type,
                });
            },
        });
    }

    // 提交表单数据
    handleOk = e => {
        e.preventDefault();

        const {
            form: {validateFields},
            handleSubmit,
            formData,
        } = this.props;

        validateFields((err, fieldsValue) => {
            if (err) return;

            if (!formData.processId) {
                const count = Math.floor(Math.random() * (8 - 1) + 1);
                fieldsValue.icon = `https://raw.githubusercontent.com/wqjiao/bpmn-activiti/master/public/icon-0${count}.png`;
            }
            handleSubmit({...fieldsValue, id: formData.processId}); // 提交流程信息
        });
    };

    render() {
        const {
            visible,
            formData,
            showModal,
            form: {getFieldDecorator},
        } = this.props;
        const {enabled, process_type} = this.state;
        const isEdit = formData.processId ? true : false;
        const style = {color: 'rgba(0, 0, 0, 0.45)', fontSize: 12};
        console.log('***', formData);

        return (
            <Modal
                title={isEdit ? '编辑流程' : '新增流程'}
                width={600}
                visible={visible}
                onOk={this.handleOk}
                onCancel={() => showModal(false)}
            >
                <Form layout="vertical">
                    <FormItem
                        label={
                            <span>
                                流程名称 <span style={style}>最多50个字</span>
                            </span>
                        }
                    >
                        {getFieldDecorator('name', {
                            initialValue: formData.processName || '',
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入流程名称',
                                },
                            ],
                        })(<Input placeholder="请输入流程名称" maxLength={50} />)}
                    </FormItem>
                    <FormItem label="选择分组">
                        {getFieldDecorator('group', {
                            initialValue: formData.processGroup || [],
                            rules: [
                                {
                                    required: true,
                                    message: '请选择分组',
                                },
                            ],
                        })(
                            <AntdSelect
                                disabled={isEdit}
                                name="group"
                                data={process_type}
                                placeholder="请选择分组"
                            />
                        )}
                    </FormItem>
                    <FormItem label="流程状态">
                        {getFieldDecorator('status', {
                            initialValue: formData.enabled || [],
                            rules: [
                                {
                                    required: true,
                                    message: '请选择流程状态',
                                },
                            ],
                        })(
                            <AntdSelect name="status" data={enabled} placeholder="请选择流程状态" />
                        )}
                    </FormItem>
                    <FormItem
                        label={
                            <span>
                                流程说明 <span style={style}>最多100个字</span>
                            </span>
                        }
                    >
                        {getFieldDecorator('remake', {
                            initialValue: formData.remake || '',
                        })(<TextArea placeholder="请输入流程说明" maxLength={100} />)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default ProcessModal;
