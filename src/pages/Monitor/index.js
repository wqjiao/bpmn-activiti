import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Row, Col} from 'antd';
import ActiveChart from './ActiveChart';
import {Map, Gauge, Pie, WaterWave, TagCloud} from './Charts';
import styles from './index.less';

@connect(({monitor, loading}) => ({
    monitor,
    tags: monitor.tags,
    submitting: loading.models.monitor,
}))
class Monitor extends Component {
    componentDidMount() {
        const {dispatch} = this.props;

        dispatch({
            type: 'monitor/fetchTags',
        });
    }

    render() {
        const {tags} = this.props;

        return (
            <Fragment>
                <Card bordered={false}>
                    <div className={styles.mapChart}>
                        <Map />
                    </div>
                </Card>

                <Card bordered={false}>
                    <ActiveChart />
                </Card>

                <Card bordered={false}>
                    <Gauge title="跳出率" height={180} percent={87} />
                </Card>

                <Card bordered={false}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Pie
                                animate={false}
                                percent={28}
                                title="中式快餐"
                                total="28%"
                                height={128}
                                lineWidth={2}
                            />
                        </Col>
                        <Col span={8}>
                            <Pie
                                animate={false}
                                color="#5DDECF"
                                percent={22}
                                title="西餐"
                                total="22%"
                                height={128}
                                lineWidth={2}
                            />
                        </Col>
                        <Col span={8}>
                            <Pie
                                animate={false}
                                color="#2FC25B"
                                percent={32}
                                title="火锅"
                                total="32%"
                                height={128}
                                lineWidth={2}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card bordered={false}>
                    <WaterWave height={161} title="补贴资金剩余" percent={34} />
                </Card>

                <Card bordered={false}>
                    <TagCloud data={tags || []} height={161} />
                </Card>
            </Fragment>
        );
    }
}

export default Monitor;
