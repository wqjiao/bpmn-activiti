import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Tooltip, Typography} from 'antd';
import SimpleTable from '@/widgets/SimpleTable';

const {Text} = Typography;

class Table extends PureComponent {
    static propTypes = {
        data: PropTypes.object,
        getData: PropTypes.func,
    };

    static defaultProps = {
        data: {},
    };

    columns = [
        {
            dataIndex: 'index',
            title: '序号',
            render: (text, record, index) => index + 1,
        },
        {
            title: '订单号',
            dataIndex: 'orderNumber',
        },
        {
            title: '审批时间',
            dataIndex: 'endTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
        },
        {
            title: '审核节点',
            dataIndex: 'taskName',
        },
        {
            title: '审批备注',
            dataIndex: 'desc',
            render: text => {
                return (
                    <div style={{whiteSpace: 'nowrap'}}>
                        {text && text.length > 20 ? (
                            <Tooltip placement="top" title={text}>
                                <Text ellipsis={true} style={{width: '250px'}}>
                                    {text}
                                </Text>
                            </Tooltip>
                        ) : (
                            <Text>{text}</Text>
                        )}
                    </div>
                );
            },
        },
    ];

    // 流程跟踪列表分页
    handleSimpleTableChange = pagination => {
        const params = {
            pageSize: pagination.pageSize,
            pageNo: pagination.current,
        };
        this.props.getData(params);
    };

    render() {
        const {loading, data} = this.props;

        return (
            <SimpleTable
                rowKey="id"
                columns={this.columns}
                loading={loading}
                data={data}
                onChange={this.handleSimpleTableChange}
                size="middle"
            />
        );
    }
}

export default Table;
