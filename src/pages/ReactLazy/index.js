import React from 'react';
import {Card} from 'antd';
import LazyLoad from 'react-lazyload';
import MyComponent from './MyComponent';

const ReactLazy = () => {
    return (
        <Card>
            <LazyLoad height={200}>
                {/* Lazy loading images is supported out of box, no extra config needed, set `height` for better experience */}
                <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxvz2cj6j20u01hck1o.jpg" />
            </LazyLoad>
            <div className="wrapper">
                {/* <Operation type="image" noExtra /> */}
                <div className="widget-list image-container">
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvyo52qj20u01hcqeq.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxvz2cj6j20u01hck1o.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvzfjv6j20u01hc496.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxw0e1mlj20u01hcgvs.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww4.sinaimg.cn/mw690/62aad664jw1f2nxw0p95dj20u01hc7d8.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxw134xqj20u01hcqjg.jpg" />
                    </LazyLoad>
                    <LazyLoad throttle={200} height={300}>
                        <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxw1kcykj20u01hcn9p.jpg" />
                    </LazyLoad>
                </div>
            </div>
            <LazyLoad height={200} once>
                {/* Once this component is loaded, LazyLoad will not care about it anymore, set this to `true` if you're concerned about improving performance */}
                <MyComponent />
            </LazyLoad>
            <LazyLoad height={200} offset={100}>
                {/* This component will be loaded when it's top edge is 100px from viewport. It's useful to make user ignorant about lazy load effect. */}
                <MyComponent />
            </LazyLoad>
            <LazyLoad>
                <MyComponent />
            </LazyLoad>
        </Card>
    );
};

export default ReactLazy;
