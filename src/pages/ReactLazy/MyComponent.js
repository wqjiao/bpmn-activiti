import React from 'react';
import {lazyload} from 'react-lazyload';

@lazyload({
    height: 200,
    once: true,
    offset: 100,
})
class MyComponent extends React.Component {
    render() {
        return <div>this component is lazyloaded by default!</div>;
    }
}

export default MyComponent;
