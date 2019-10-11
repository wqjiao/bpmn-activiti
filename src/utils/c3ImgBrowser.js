/*!
	c3ImgBrowser 1.0.0
	license: MIT 
*/
import transform from './transform.js';

window.c3ImgBrowser = (function() {
    let defaults = {
        zoom: 0.1,
    };

    let main = function(img, options) {
        let trueImg;

        if (!img || !img.nodeName) {
            return;
        } else if (img.nodeName !== 'IMG') {
            // trueImg = $(img).find('img')[0];
            trueImg = img.children[0];
        } else {
            trueImg = img;
        }

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

        function reset() {
            bgWidth = width;
            bgHeight = height;
            bgPosX = bgPosY = 0;
            rotateZ = 0;
            updateBgStyle();
        }

        // 1.鼠标/点击按钮:放大/缩小;2.shift+鼠标:旋转
        function onwheel(e, type) {
            let deltaY = 0;

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
            } else if (type === 'zoomIn') {
                bgWidth += initWidth * 0.1;
                bgHeight += initHeight * 0.1;
                updateBgStyle();
                return;
            } else if (type === 'zoomOut') {
                bgWidth -= initWidth * 0.1;
                bgHeight -= initHeight * 0.1;
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

        // 放大
        function onzoomIn(e) {
            onwheel(e, 'zoomIn');
        }

        // 缩小
        function onzoomOut(e) {
            onwheel(e, 'zoomOut');
        }

        // 旋转
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

        // 点击拖拽
        function drag(e) {
            e.preventDefault();
            bgPosX += e.pageX - previousEvent.pageX;
            bgPosY += e.pageY - previousEvent.pageY;
            previousEvent = e;
            updateBgStyle();
        }

        // 取消拖拽
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

        function load() {
            if (trueImg.src === cachedDataUrl) return;

            let computedStyle = window.getComputedStyle(img, null);

            width = parseInt(computedStyle.width, 10);
            height = parseInt(computedStyle.height, 10);

            bgWidth = width * trueImg.scaleX;
            bgHeight = height * trueImg.scaleY;

            bgPosX = trueImg.translateX;
            bgPosY = trueImg.translateY;

            rotateZ = trueImg.rotateZ;

            img.addEventListener('c3ImgBrowser.reset', reset);
            img.addEventListener('c3ImgBrowser.rotate', onrotate);
            img.addEventListener('c3ImgBrowser.zoomIn', onzoomIn);
            img.addEventListener('c3ImgBrowser.zoomOut', onzoomOut);
            img.addEventListener('wheel', onwheel);
            img.addEventListener('mousedown', draggable);
        }

        let destroy = function(originalProperties) {
            img.removeEventListener('c3ImgBrowser.destroy', destroy);
            img.removeEventListener('c3ImgBrowser.reset', reset);
            img.removeEventListener('c3ImgBrowser.rotate', onrotate);
            img.removeEventListener('c3ImgBrowser.zoomIn', onzoomIn);
            img.removeEventListener('c3ImgBrowser.zoomOut', onzoomOut);
            img.removeEventListener('load', load);
            img.removeEventListener('wheel', onwheel);
            img.removeEventListener('mouseup', removeDrag);
            img.removeEventListener('mousemove', drag);
            img.removeEventListener('mousedown', draggable);
            img.src = originalProperties.src;
        }.bind(null, {
            src: img.src,
        });

        img.addEventListener('c3ImgBrowser.destroy', destroy);

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
                Array.prototype.forEach.call(elements, main, options);
            } else if (elements && elements.nodeName) {
                main(elements, options);
            }
            return elements;
        };
    }
})();
