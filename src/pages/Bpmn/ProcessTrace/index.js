import React, {Component} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card, Button} from 'antd';
import Bpmn from './Bpmn'; // 流程跟踪图
import Table from './Table'; // 流程跟踪列表

const tabList = [
    {
        key: 'tab1',
        tab: '流程图',
    },
    {
        key: 'tab2',
        tab: '流程列表',
    },
];

/* eslint react/no-multi-comp:0 */
@connect(({loading}) => ({
    loading: loading.models.publicModel,
}))
class ProcessTrace extends Component {
    state = {
        tabKey: 'tab1', // tab切换
        detailInfo: {}, // 流程跟踪详情
        data: {}, // 流程跟踪列表
    };

    componentDidMount() {
        this.getProcessData();
    }

    // 获取流程跟踪列表数据
    getProcessData = params => {
        const {
            dispatch,
            match: {
                params: {orderId},
            },
        } = this.props;

        dispatch({
            type: 'processManage/getProcessData',
            payload: {...params, orderId} || {orderId},
            callback: data => {
                this.setState({data});
            },
        });
    };

    // Bpmn 流程图点击事件回调
    handleCallback = id => {
        const {dispatch} = this.props;

        dispatch({
            type: 'processManage/getPageUseDict',
            payload: {
                codes: 'enabled,process_type',
            },
            callback: () => {
                this.setState({
                    detailInfo: {
                        id,
                    },
                });
            },
        });
    };

    // 切换流程图/列表
    handleTabsChange = key => {
        this.setState({
            tabKey: key,
        });
    };

    // 返回上一步
    handleBack = () => {
        router.goBack();
    };

    render() {
        const {loading} = this.props;
        const {tabKey, data, detailInfo} = this.state;
        const contentList = {
            tab1: <Bpmn data={detailInfo} callback={this.handleCallback} />,
            tab2: <Table loading={loading} data={data} getData={this.getProcessData} />,
        };

        return (
            <Card
                bordered={false}
                // title="流程跟踪"
                tabList={tabList}
                activeTabKey={tabKey}
                onTabChange={this.handleTabsChange}
                // extra={<Button onClick={this.handleBack}>返回</Button>}
                style={{width: '100%', height: '100%'}}
                bodyStyle={{height: 'calc(100% - 55px)'}}
            >
                <Button
                    style={{position: 'absolute', top: 10, right: 16}}
                    onClick={this.handleBack}
                >
                    返回
                </Button>
                {contentList[tabKey]}
            </Card>
        );
    }
}

export default ProcessTrace;
