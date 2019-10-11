/*
 * @Author: wqjiao
 * @Date: 2019-09-20 18:10:01
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-20 18:11:46
 * @Description: 信息轮播 -- 在普通 React 项目中，需要将类名的 styles. 替换成字符串类型
 */
import React from 'react';
import AntdCarousel from './AntdCarousel';
import CustomPag from './CustomPag';
import AsNavFor from './AsNavFor';

const ReactSlick = ({children}) =>
    React.Children.map(children, child => (child ? React.cloneElement(child, {}) : child));

ReactSlick.AntdCarousel = AntdCarousel;
ReactSlick.CustomPag = CustomPag;
ReactSlick.AsNavFor = AsNavFor;

export default ReactSlick;
