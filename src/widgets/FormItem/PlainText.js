/*
 * @Author: wqjiao
 * @Date: 2019-03-31 19:33:48
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-11-26 14:59:22
 * @Description: PlainText 纯文本
 */
import React, {PureComponent} from 'react';

export default class PlainText extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || '',
        };
    }

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value,
            };
        }
        return null;
    }

    render() {
        return <span>{this.state.value}</span>;
    }
}
