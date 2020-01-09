/*
 * @Author: wqjiao
 * @Date: 2019-05-06 11:49:01
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-20 10:07:03
 * @Description: BasicLine 基础折线图 -- x 最多显示 10 个坐标点
 */
import React from 'react';
import {Chart, Geom, Axis, Tooltip} from 'bizcharts';
import AntdEmpty from '@/widgets/AntdEmpty';

class BasicLine extends React.Component {
    render() {
        const {x, y, name, padding = 'auto'} = this.props;
        let data = this.props.data,
            range = [0, 1];

        // 暂无数据图标
        if (data.length === 0) {
            return <AntdEmpty />;
        } else if (data.length === 1) {
            // fixbug -- length为1，x为类似'2019-05-10'时，range不起作用
            data = data.map(item => {
                return {
                    ...item,
                    [x]: ` ${item[x]}`,
                };
            });
            range = [0.5, 1];
        }

        // 坐标轴刻度个数
        const cols = {
            [x]: {
                range, // 输出数据的范围
                tickCount: 10, // 设置坐标轴上刻度点的个数
                sync: true,
            },
            [y]: {
                min: 0,
            },
        };
        // 提示信息
        const tooltip = [
            `${x}*${y}`,
            (x, y) => {
                return {
                    title: x,
                    name: name,
                    value: y,
                };
            },
        ];
        const labelX = {
            offset: 20, // 与坐标轴线的距离
        };

        return (
            <Chart height={400} data={data} scale={cols} forceFit placeholder padding={padding}>
                <Axis name={x} label={labelX} />
                <Axis name={y} />
                <Tooltip crosshairs={{type: 'y'}} />
                <Geom type="line" position={`${x}*${y}`} size={2} tooltip={tooltip} />
                <Geom
                    type="point"
                    position={`${x}*${y}`}
                    size={4}
                    shape={'circle'}
                    style={{
                        stroke: '#fff',
                        lineWidth: 1,
                    }}
                    tooltip={tooltip}
                />
            </Chart>
        );
    }
}

export default BasicLine;
