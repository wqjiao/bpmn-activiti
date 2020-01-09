import React from 'react';

export default class MyInput extends React.Component {
    constructor(props) {
        super(props);
        // 分配给实例属性
        this.inputRef = React.createRef(null);
    }

    componentDidMount() {
        // 通过 this.inputRef.current 获取对该节点的引用
        this.inputRef && this.inputRef.current.focus();
    }

    render() {
        // 把 <input> ref 关联到构造函数中创建的 `inputRef` 上
        return <input type="text" ref={this.inputRef} />;
    }
}
