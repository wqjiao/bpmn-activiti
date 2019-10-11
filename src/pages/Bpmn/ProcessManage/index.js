/*
 * @Author: wqjiao
 * @Date: 2019-08-23 11:11:27
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-10-11 14:49:42
 * @Description: 基础设置 -> 流程管理
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import {Card, List, Avatar, Button, notification, Popconfirm} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AntdEmpty from '@/widgets/AntdEmpty';
import ProcessModal from './components/ProcessModal';
import styles from './index.less';

/* eslint react/no-multi-comp:0 */
@connect(({processManage, loading}) => ({
    processManage,
    data: processManage.data,
    loading: loading.models.processManage,
}))
class ProcessManage extends PureComponent {
    state = {
        visible: false, // 新增/编辑弹窗
        formData: {}, // 流程弹窗数据
    };

    componentDidMount() {
        this.getFlowList(); // 获取流程列表
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'processManage/clear',
        });
    }

    // 获取流程列表
    getFlowList = () => {
        this.props.dispatch({
            type: 'processManage/getFlowList',
        });
    };

    // 新增/编辑流程弹窗
    handleEdit = (visible, data) => {
        this.setState({
            visible,
            formData: data || {},
        });
    };

    // 提交新增/编辑流程信息
    handleSubmit = values => {
        const {dispatch} = this.props;

        dispatch({
            type: 'processManage/updateFlow',
            payload: values,
            callback: () => {
                this.getFlowList(); // 更新流程信息
                this.handleEdit(false); // 关闭流程弹窗
            },
        });
    };

    // 流程设计
    handleProcess = processId => {
        router.push(`/bpmn/processManage/edit/${processId}`);
    };

    // 复制流程
    handleCopy = data => {
        const {dispatch} = this.props;
        const count = Math.floor(Math.random() * (8 - 1) + 1);

        dispatch({
            type: 'processManage/copyFlow',
            payload: {
                id: data.processId,
                icon: `https://raw.githubusercontent.com/wqjiao/bpmn-activiti/master/public/icon-0${count}.png`,
            },
            callback: () => {
                notification.info({
                    message: '提示',
                    description: '流程复制成功!',
                });
                this.getFlowList(); // 更新流程信息
            },
        });
    };

    // 删除流程
    handleDelete = data => {
        const {dispatch} = this.props;

        dispatch({
            type: 'processManage/deleteFlow',
            payload: {
                id: data.processId,
            },
            callback: () => {
                notification.info({
                    message: '提示',
                    description: '流程删除成功!',
                });
                this.getFlowList(); // 更新流程信息
            },
        });
    };

    render() {
        const {
            props: {
                dispatch,
                route: {cnName},
                data,
            },
            state: {visible, formData},
        } = this;
        // 流程内容
        const ListContent = ({data: {nodeNum}}) => (
            <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                    <span>流程节点总数</span>
                    <p>{nodeNum}</p>
                </div>
            </div>
        );

        return (
            <PageHeaderWrapper title={cnName || '流程管理'}>
                {/* 创建新流程 */}
                <Card bordered={false} className={styles.processCard}>
                    <Button type="primary" icon="plus" onClick={() => this.handleEdit(true)}>
                        创建新流程
                    </Button>
                </Card>

                {/* 流程管理数据 */}
                {data.length > 0 ? (
                    data.map(item => {
                        const {groupName, groupNum, list} = item;
                        const isInvalid = groupName === '已停用流程'; // 停用标志

                        return (
                            <Card
                                key={item.groupName}
                                bordered={false}
                                title={`${groupName}(${groupNum})`}
                                className={styles.processCard}
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={list}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[
                                                <a
                                                    key="process"
                                                    onClick={() =>
                                                        this.handleProcess(item.processId)
                                                    }
                                                >
                                                    流程设计
                                                </a>,
                                                <a
                                                    key="edit"
                                                    onClick={() => this.handleEdit(true, item)}
                                                >
                                                    编辑
                                                </a>,
                                                <a key="copy" onClick={() => this.handleCopy(item)}>
                                                    复制
                                                </a>,
                                                <Popconfirm
                                                    key="delete"
                                                    title="确定删除该流程么?"
                                                    onConfirm={() => this.handleDelete(item)}
                                                >
                                                    <a href="#">删除</a>
                                                </Popconfirm>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        className={classNames({
                                                            [styles.invalidIcon]: isInvalid,
                                                        })}
                                                        src={item.icon}
                                                        shape="square"
                                                        size="large"
                                                    />
                                                }
                                                title={item.processName}
                                                description={item.updateTime}
                                            />
                                            <ListContent data={item} />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        );
                    })
                ) : (
                    <Card>
                        <AntdEmpty />
                    </Card>
                )}

                {/* 新增/编辑 流程 */}
                {visible && (
                    <ProcessModal
                        dispatch={dispatch}
                        visible={visible}
                        formData={formData}
                        showModal={this.handleEdit}
                        handleSubmit={this.handleSubmit}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default ProcessManage;
