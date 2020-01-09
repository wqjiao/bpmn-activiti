/*
 * @Author: wqjiao
 * @Date: 2019-05-08 16:56:48
 * @Last Modified by:   wqjiao
 * @Last Modified time: 2019-05-08 16:56:48
 * @Description: NewPortal React 传送门
 */
import React from 'react';
import ReactDOM from 'react-dom';

class NewPortal extends React.Component {
    constructor(props) {
        super(props);
        this.node = document.createElement('div');
        this.node.style.position = 'absolute';
        this.node.style.top = '0';
        this.node.style.left = '0';
        this.node.style.width = '100%';
        document.body.appendChild(this.node);
    }

    render() {
        const {children} = this.props;
        return ReactDOM.createPortal(children, this.node);
    }
}
export default NewPortal;
