/*
 * @Author: wqjiao
 * @Date: 2019-05-07 11:03:22
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-12-27 18:54:23
 * @Description: BasicBar 基本柱状图
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Chart, Geom, Axis, Tooltip, Label} from 'bizcharts';
import AntdEmpty from '@/widgets/AntdEmpty';
class BasicBar extends React.Component {
    static propTypes = {
        // x: PropTypes.String,
        // y: PropTypes.String,
        data: PropTypes.array,
        padding: PropTypes.array,
        hasLabel: PropTypes.bool,
        rotate: PropTypes.number,
    };

    static defaultProps = {
        x: 'x',
        y: 'y',
        data: [],
        padding: [30, 'auto', 'auto', 'auto'],
        hasLabel: false,
        rotate: 0,
    };

    render() {
        const {x, y, data, padding, hasLabel, rotate} = this.props;

        // 暂无数据图标
        if (!data || data.length === 0) {
            return <AntdEmpty />;
        }

        // const count = data && data.length;
        const width = document.body.clientWidth;
        const total = data.reduce((pre, now) => now[y] + pre, 0);
        const cols = {
            [x]: {
                type: 'cat',
                tickCount: width < 1366 ? 5 : null, // 设置坐标轴上刻度点的个数
                // range: [1 / (2 * count - 1), 1 - 1 / (2 * count - 1)], // 输出数据的范围
            },
            [y]: {
                min: 0,
                // tickInterval: 20
            },
        };
        // 提示信息
        const tooltip = [
            `${x}*${y}`,
            (x, y) => {
                const value = `${total ? ((y * 100) / total).toFixed(2) : 0}%   ${y}`;
                return {
                    title: x,
                    // name: name,
                    // value: y,
                    value,
                };
            },
        ];
        const labelX = {
            offset: 50, // 与坐标轴线的距离
            rotate,
            // rotate: 30,
            formatter(text) {
                return `${text.slice(0, 10)}\n${text.slice(10, 20)}\n${text.slice(
                    20,
                    text.length
                )}`;
            }, // 坐标文案换行
        };
        const color = 'rgba(24, 144, 255, 0.85)';

        return (
            <Chart height={400} data={data} scale={cols} forceFit placeholder padding={padding}>
                <Axis name={x} label={labelX} />
                <Axis name={y} />
                <Tooltip crosshairs={false} />
                <Geom type="interval" position={`${x}*${y}`} color={color} tooltip={tooltip}>
                    {hasLabel && (
                        <Label
                            content="interval"
                            formatter={(val, item) => {
                                // const value = `${total ? (item.point[y] / total) : 0}%  ${item.point[y]}`;
                                return item.point[y];
                            }}
                        />
                    )}
                </Geom>
            </Chart>
        );
    }
}

export default BasicBar;
