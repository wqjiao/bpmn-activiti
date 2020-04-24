/*!
	imgBrowser 1.2.0
	license: MIT 
*/
import transform from './transform.js';

window.imgBrowser = (function() {
    let defaults = {
        zoom: 0.1,
        fobiddenWheel: false, // 禁止滚轮缩放
    };

    let main = function(img, options) {
        let trueImg; // 真实的img对象
        if (!img || !img.nodeName) {
            return;
        } else if (img.nodeName !== 'IMG') {
            trueImg = $(img).find('img')[0];
        } else {
            trueImg = img;
        }

        // 对图片进行初始化，会加上scaleX，translateX等属性，都是默认值，比如scaleX是1，translateX是0。
        transform(trueImg);

        let settings = {};
        let width;
        let height;
        let bgWidth;
        let bgHeight;
        let bgPosX;
        let bgPosY;
        let rotateZ = 0;
        let previousEvent;
        let cachedDataUrl;

        function updateBgStyle() {
            trueImg.rotateZ = rotateZ;
            trueImg.scaleX = bgWidth / width;
            trueImg.scaleY = bgWidth / width;
            trueImg.translateX = bgPosX;
            trueImg.translateY = bgPosY;
        }

        // 重置
        function reset() {
            bgWidth = width;
            bgHeight = height;
            bgPosX = bgPosY = 0;
            rotateZ = 0;
            updateBgStyle();
        }

        // 滚轮控制图片缩放
        function onwheel(e) {
            let deltaY = 0;

            if (settings.fobiddenWheel) {
                return;
            }

            // 初始化图片方向
            e.preventDefault();
            if (e.deltaY) {
                // FireFox 17+ (IE9+, Chrome 31+?)
                deltaY = e.deltaY;
            } else if (e.wheelDelta) {
                deltaY = -e.wheelDelta;
            }

            let rect = trueImg.getBoundingClientRect();
            let offsetX = e.pageX - rect.left;
            let offsetY = e.pageY - rect.top;
            let initWidth = bgWidth;
            let initHeight = bgHeight;

            if (window.event.shiftKey) {
                if (deltaY < 0) {
                    rotateZ += 10;
                } else {
                    rotateZ -= 10;
                }
                updateBgStyle();
                return;
            } else {
                if (deltaY < 0) {
                    bgWidth += initWidth * settings.zoom;
                    bgHeight += initHeight * settings.zoom;
                } else {
                    bgWidth -= initWidth * settings.zoom;
                    bgHeight -= initHeight * settings.zoom;
                }
            }

            if (offsetX > bgWidth / 2 && offsetY < bgHeight / 2) {
                if (deltaY < 0) {
                    bgPosX = bgPosX - Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY + Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                } else {
                    bgPosX = bgPosX + Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY - Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                }
            } else if (offsetX > bgWidth / 2 && offsetY > bgHeight / 2) {
                if (deltaY < 0) {
                    bgPosX = bgPosX - Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY - Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                } else {
                    bgPosX = bgPosX + Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY + Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                }
            } else if (offsetX < bgWidth / 2 && offsetY > bgHeight / 2) {
                if (deltaY < 0) {
                    bgPosX = bgPosX + Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY - Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                } else {
                    bgPosX = bgPosX - Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY + Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                }
            } else {
                if (deltaY < 0) {
                    bgPosX = bgPosX + Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY + Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                } else {
                    bgPosX = bgPosX - Math.abs(initWidth / 2 - offsetX) * settings.zoom;
                    bgPosY = bgPosY - Math.abs(initHeight / 2 - offsetY) * settings.zoom;
                }
            }

            updateBgStyle();
        }
        // 图片缩放
        function onscale(e) {
            if (e.detail.scale > 0) {
                bgWidth *= 1.2;
            } else {
                bgWidth /= 1.2;
            }
            updateBgStyle();
        }
        // 图片旋转
        function onrotate() {
            // 如果是90度的证书，要加90度
            if (!(rotateZ % 90)) {
                rotateZ += 90;
            } else {
                // ceil是不足1，加1，向上取整
                rotateZ = Math.ceil(rotateZ / 90) * 90;
            }
            updateBgStyle();
        }
        // 拖拽控制图片移动
        function drag(e) {
            e.preventDefault();
            bgPosX += e.pageX - previousEvent.pageX;
            bgPosY += e.pageY - previousEvent.pageY;
            previousEvent = e;
            updateBgStyle();
        }
        // 删除拖拽事件
        function removeDrag() {
            document.removeEventListener('mouseup', removeDrag);
            document.removeEventListener('mousemove', drag);
        }

        // Make image draggable
        function draggable(e) {
            e.preventDefault();
            previousEvent = e;
            // 初始化图片方向
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', removeDrag);
        }

        // 图片加载完成之后
        function load() {
            if (trueImg.src === cachedDataUrl) return;

            // 获取当前图片的计算样式
            let computedStyle = window.getComputedStyle(img, null);

            // 展示的宽高
            width = parseInt(computedStyle.width, 10);
            height = parseInt(computedStyle.height, 10);

            // 默认的缩放，计算默认的图片宽度
            bgWidth = width * trueImg.scaleX;
            bgHeight = height * trueImg.scaleY;
            // 默认的移动
            bgPosX = trueImg.translateX;
            bgPosY = trueImg.translateY;
            // 默认的旋转
            rotateZ = trueImg.rotateZ;

            img.addEventListener('imgBrowser.reset', reset);
            img.addEventListener('imgBrowser.rotate', onrotate);
            img.addEventListener('imgBrowser.scale', onscale);
            img.addEventListener('wheel', onwheel);
            img.addEventListener('mousedown', draggable);
        }

        let destroy = function(originalProperties) {
            img.removeEventListener('imgBrowser.destroy', destroy);
            img.removeEventListener('imgBrowser.reset', reset);
            img.removeEventListener('imgBrowser.rotate', onrotate);
            img.removeEventListener('imgBrowser.scale', onscale);
            img.removeEventListener('load', load);
            img.removeEventListener('mouseup', removeDrag);
            img.removeEventListener('mousemove', drag);
            img.removeEventListener('mousedown', draggable);
            img.removeEventListener('wheel', onwheel);
            img.src = originalProperties.src;
        }.bind(null, {
            src: img.src,
        });

        img.addEventListener('imgBrowser.destroy', destroy);

        options = options || {};

        Object.keys(defaults).forEach(function(key) {
            settings[key] = options[key] !== undefined ? options[key] : defaults[key];
        });
        if (trueImg.complete) {
            load();
        }
        trueImg.addEventListener('load', load);
    };

    // Do nothing in IE8
    if (typeof window.getComputedStyle !== 'function') {
        return function(elements) {
            return elements;
        };
    } else {
        return function(elements, options) {
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, function(item) {
                    main(item, options);
                });
            } else if (elements && elements.nodeName) {
                main(elements, options);
            }
            return elements;
        };
    }
})();
