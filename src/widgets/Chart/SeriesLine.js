/*
 * @Author: wqjiao
 * @Date: 2019-05-07 11:03:53
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-05-10 15:32:43
 * @Description: SeriesLine 两条折线图 -- x 最多显示 10 个坐标点
 */
import React from 'react';
import {Chart, Geom, Axis, Tooltip, Legend} from 'bizcharts';
import DataSet from '@antv/data-set';

class SeriesLine extends React.Component {
    render() {
        const {x, y1, y2, forMap, padding = 'auto'} = this.props;
        let data = this.props.data,
            range = [0, 1];
        // fixbug -- length为1，x为类似'2019-05-10'时，range不起作用
        if (data.length === 1) {
            data = data.map(item => {
                return {
                    ...item,
                    [x]: ` ${item[x]}`,
                };
            });
            range = [0.5, 1];
        }
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        // Transform 数据转换
        dv.transform({
            type: 'fold',
            fields: [y1, y2], // 展开字段集
            key: 'key', // key字段
            value: 'value', // value字段
        });
        // 坐标轴刻度个数
        const cols = {
            [x]: {
                range, // 输出数据的范围
                tickCount: 10, // 设置坐标轴上刻度点的个数
                sync: true,
            },
            // [y1]: {
            //     min: 0,
            // },
            // [y2]: {
            //     min: 0,
            // },
        };
        const labelX = {
            offset: 20, // 与坐标轴线的距离
        };
        const labelY = {
            formatter: val => `${val}%`,
        };

        return (
            <Chart height={400} data={dv} scale={cols} forceFit placeholder padding={padding}>
                <Legend textStyle={{fontSize: '14'}} itemFormatter={item => forMap[item]} />
                <Axis name={x} label={labelX} />
                <Axis name="value" label={labelY} />
                <Tooltip crosshairs={{type: 'y'}} />
                <Geom
                    type="line"
                    position={`${x}*value`}
                    size={2}
                    color={'key'}
                    // shape={"smooth"} // 曲线 -- 默认折线
                    tooltip={[
                        `${x}*key*value`,
                        function(x, key, value) {
                            return {
                                title: x,
                                name: forMap[key],
                                value: `${value}%`,
                            };
                        },
                    ]}
                />
                <Geom
                    type="point"
                    position={`${x}*value`}
                    size={4}
                    shape={'circle'}
                    color={'key'}
                    style={{
                        stroke: '#fff',
                        lineWidth: 1,
                    }}
                    tooltip={[
                        `${x}*key*value`,
                        function(x, key, value) {
                            return {
                                title: x,
                                name: forMap[key],
                                value: `${value}%`,
                            };
                        },
                    ]}
                />
            </Chart>
        );
    }
}

export default SeriesLine;
