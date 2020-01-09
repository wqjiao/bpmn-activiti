/*
 * @Author: wqjiao
 * @Date: 2019-02-19 15:49:55
 * @Last Modified by: wqjiao
 * @Last Modified time: 2020-01-09 12:01:37
 * @Description: TuiImageEditor 编辑器组件
 * 图形、文案、画笔、旋转、截图
 * @use
 *  <TuiImageEditor
        originImage={originImage}
        callback={me.props.ImageEditorCallback}
        _key={c_i} // 同一个页面需要多个 '编辑' 时，避免出现多个相同 id
        is_after_loan={true} // 是否为贷后订单
    />
 */
import React from 'react';
import $ from 'jquery';
import ImageEditor from 'tui-image-editor';
import theme from './theme.js';
import {notification, Modal} from 'antd';
import 'tui-image-editor/dist/tui-image-editor.min.css';
import './index.less';

export default class TuiImageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originImage: {
                id: '',
                order_id: '',
                orig_pic_url: '',
            },
            visible: false,
        };
    }

    // 初始化
    initImageEditor = originImage => {
        let me = this;
        let editor_menu = ['shape', 'text', 'draw']; // 贷前订单
        let loan_editor_menu = ['shape', 'text', 'draw', 'rotate', 'crop']; // 贷后订单

        this.imageEditor = new ImageEditor(
            document.querySelector('#tui-image-editor-' + me.props._key),
            {
                includeUI: {
                    locale: {
                        'Text size': '文字大小',
                        Range: '范围',
                        Rectangle: '正方形',
                        Circle: '圆形',
                        Triangle: '正方形',
                        'Delete-all': '删除全部',
                        Fill: '填充',
                        Stroke: '线条',
                        Undo: '撤消',
                        Redo: '返回',
                        Delete: '删除',
                        Reset: '重置',
                        Text: '文案',
                        Draw: '画笔',
                        Shape: '图形',
                        Custom: '自定义',
                        Square: '正方形',
                        Apply: '应用',
                        Cancel: '取消',

                        Bold: '加粗',
                        Italic: '倾斜',
                        Underline: '下划线',
                        Left: '左对齐',
                        Right: '右对齐',
                        Center: '居中',
                        Color: '颜色',
                        Straight: '直线',
                        Free: '曲线',
                        Rotate: '旋转',
                        Crop: '截取',
                    },
                    loadImage: {
                        path: originImage.orig_pic_url,
                        name: originImage.id,
                    },
                    menu: me.props.is_after_loan ? loan_editor_menu : editor_menu,
                    // menu: ['shape', 'text', 'draw', 'rotate', 'crop'],
                    theme: theme.blackTheme,
                    menuBarPosition: 'left',
                },
                cssMaxWidth: 700,
                cssMaxHeight: 500,
            }
        );

        this.imageEditor.ui.shape.setShapeStatus({
            strokeColor: '#ff4040',
            strokeWidth: 30,
        });

        this.imageEditor.ui.text.fontSize = 130;
    };

    static getDerivedStateFromProps(nextProps) {
        if ('originImage' in nextProps) {
            return {
                originImage: nextProps.originImage,
            };
        }
        return null;
    }

    componentDidMount() {
        if (this.props.originImage) {
            this.setState({
                originImage: this.props.originImage,
            });
        }
        // console.log('originImage', this.props.originImage);
    }

    // 点击编辑 -- 显示编辑弹窗
    open = () => {
        let originImage = this.state.originImage;
        this.setState(
            {
                visible: true,
            },
            function() {
                this.initImageEditor(originImage);
            }
        );
    };

    // 关闭编辑弹窗
    close = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 同步url
     * @param  {[type]} id         [description]
     * @param  {[type]} image_path [description]
     * @return {[type]}            [description]
     */
    imageAnnotate = (id, image_path) => {
        let url = '',
            type = '';

        // 贷后订单 -- 图片编辑同步 url
        if (this.props.is_after_loan) {
            url = 'loan/image/annotate/';
            type = 'POST';
        } else {
            url = 'image/annotate/';
            type = 'PUT';
        }

        $.ajax({
            url: url + id,
            // url: 'loan/image/annotate/' + id,
            data: {
                image_path: image_path,
            },
            type: type,
            // type: 'POST',
            dataType: 'json',
            success: function(e) {
                if (e.success) {
                    notification['success']({
                        message: '提示',
                        description: '图片保存成功',
                    });
                } else {
                    notification['success']({
                        message: '提示',
                        description: '图片保存失败',
                    });
                }
            },
            error: function() {
                notification['error']({
                    message: '提示',
                    description: '图片保存失败',
                });
            },
        });
    };

    // 确定保存编辑后的图片
    save = () => {
        let me = this;
        let originImage = me.state.originImage;
        let dataURL = me.imageEditor.toDataURL({
            quality: 0.3,
            format: 'jpeg',
        });
        let url = '';

        // 贷后订单 -- 编辑图片保存 base64
        if (this.props.is_after_loan) {
            url = 'api/loan/upload/pic_base64';
        } else {
            url = 'https://localhost:8000/upload/pic_base64';
        }

        $.ajax({
            url: url,
            // url: 'api/loan/upload/pic_base64',
            data: {
                pic_base64: dataURL,
            },
            type: 'POST',
            dataType: 'json',
            success: function(e) {
                let url = e.data.domain + e.data.pic_prefix + e.data.pic;
                // 更新本地 store
                let newImage = {
                    ...originImage,
                    edit_pic_url: url,
                };

                me.close();
                // console.log('newImage', newImage);
                me.props.callback && me.props.callback(newImage);

                // 贷后订单 -- 编辑图片保存 url
                if (this.props.is_after_loan) {
                    me.imageAnnotate(originImage.id, e.data.pic);
                } else {
                    me.imageAnnotate(originImage.id, url);
                }
                // me.imageAnnotate(originImage.id, e.data.pic);
            },
            error: function(e) {
                notification['error']({
                    message: '提示',
                    description: e.message,
                    duration: 0,
                });
            },
        });
    };

    render() {
        let me = this;

        return (
            <div className="imageeditor" style={me.props.style}>
                <img
                    className="openimageeditor"
                    src="../../assets/1547108589810.png"
                    onClick={me.open}
                />
                <div className={'imageeditormodal-' + me.props._key}>
                    <Modal
                        zIndex={20000}
                        style={{width: '1000px'}}
                        getContainer={() =>
                            document.querySelector('.imageeditormodal-' + me.props._key)
                        }
                        width="1000px"
                        title="编辑"
                        visible={this.state.visible}
                        onOk={this.save}
                        onCancel={this.close}
                        okText="保存"
                        cancelText="取消"
                    >
                        <div id={'tui-image-editor-' + me.props._key} />
                    </Modal>
                </div>
            </div>
        );
    }
}
