/*
 * @Author: wqjiao
 * @Date: 2019-08-23 11:11:27
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-10-11 14:49:52
 * @Description: 基础设置 -> 流程管理 -> 流程设计
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card, Form, Button, notification} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import FullModal from '@/widgets/FullModal';

// Bpmn 相关文件
import propertiesPanelModule from 'bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import propertiesProviderModule from './BpmnEditor/Toolbar';
import EditingTools from './BpmnEditor/EditingTools';
import BpmnModeler from './BpmnEditor/Modeler';
import {diagramXML} from './BpmnEditor/sources/xml';
import styles from './BpmnEditor/sources/Bpmn.less';

@connect(({processManage, loading}) => ({
    processManage,
    loading: loading.models.processManage,
}))
@Form.create()
class ProcessDesign extends Component {
    state = {
        scale: 1, // 流程图比例
        svgVisible: false, // 预览图片
        svgSrc: '', // 图片地址
    };

    componentDidMount() {
        const {
            dispatch,
            match: {params},
        } = this.props;

        dispatch({
            type: 'processManage/initFlowSelect',
            callback: data => {
                const {condition, node_type, node_belong, rule_operator, roles, users} = data;
                const options = {
                    condition: this.translateData(condition, 'name', 'script'),
                    node_type: this.translateData(node_type),
                    node_belong: this.translateData(node_belong),
                    rule_operator: this.translateData(rule_operator),
                    roles: this.translateData(roles, 'name', 'id'),
                    users: this.translateData(users, 'name', 'id'),
                };
                window.sessionStorage.setItem('flowOptions', JSON.stringify(options));
                // 获取流程设计 xml
                dispatch({
                    type: 'processManage/findBPMNById',
                    payload: {
                        id: params.id,
                        type: 'xml',
                    },
                    callback: xml => {
                        this.bpmnModeler = new BpmnModeler({
                            container: '#canvas',
                            propertiesPanel: {
                                parent: '#properties-panel',
                            },
                            additionalModules: [propertiesPanelModule, propertiesProviderModule],
                            moddleExtensions: {
                                camunda: camundaModdleDescriptor,
                            },
                        });
                        this.renderDiagram(xml || diagramXML);
                        // 删除 bpmn logo
                        const bjsIoLogo = document.querySelector('.bjs-powered-by');
                        while (bjsIoLogo.firstChild) {
                            bjsIoLogo.removeChild(bjsIoLogo.firstChild);
                        }
                    },
                });
            },
        });
    }

    componentWillUnmount() {
        window.sessionStorage.removeItem('flowOptions');
        this.props.dispatch({
            type: 'processManage/clear',
        });
    }

    // key value 转换
    translateData(data, name = 'label', value = 'value') {
        if (!data) return;

        return data.map(item => {
            return {
                name: item[name],
                value: item[value],
            };
        });
    }

    /**
     * 下载xml/svg
     *  @param  type  类型  svg / xml
     *  @param  data  数据
     *  @param  name  文件名称
     */
    download = (type, data, name) => {
        let dataTrack = '';
        const a = document.createElement('a');

        switch (type) {
            case 'xml':
                dataTrack = 'bpmn';
                break;
            case 'svg':
                dataTrack = 'svg';
                break;
            default:
                break;
        }

        name = name || `diagram.${dataTrack}`;

        a.setAttribute(
            'href',
            `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
        );
        a.setAttribute('target', '_blank');
        a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
        a.setAttribute('download', name);

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 导入 xml 文件
    handleOpenFile = e => {
        const that = this;
        const file = e.target.files[0];
        const reader = new FileReader();
        let data = '';
        reader.readAsText(file);
        reader.onload = function(event) {
            data = event.target.result;
            that.renderDiagram(data, 'open');
        };
    };

    // 保存
    handleSave = () => {
        const {
            dispatch,
            match: {params},
        } = this.props;
        let json_xml = '',
            svg_xml = '';

        this.bpmnModeler.saveXML({format: true}, (err, xml) => {
            console.log(xml);
            json_xml = xml;
        });
        this.bpmnModeler.saveSVG({format: true}, (err, data) => {
            console.log(data);
            svg_xml = data;
        });

        dispatch({
            type: 'processManage/updateBPMN',
            payload: {
                id: params.id,
                json_xml,
                svg_xml,
            },
            callback: () => {
                this.handleBack(); // 返回列表页
            },
        });
    };

    // 前进
    handleRedo = () => {
        this.bpmnModeler.get('commandStack').redo();
    };

    // 后退
    handleUndo = () => {
        this.bpmnModeler.get('commandStack').undo();
    };

    // 下载 SVG 格式
    handleDownloadSvg = () => {
        this.bpmnModeler.saveSVG({format: true}, (err, data) => {
            this.download('svg', data);
        });
    };

    // 下载 XML 格式
    handleDownloadXml = () => {
        this.bpmnModeler.saveXML({format: true}, (err, data) => {
            this.download('xml', data);
        });
    };

    // 流程图放大缩小
    handleZoom = radio => {
        const newScale = !radio
            ? 1.0 // 不输入radio则还原
            : this.state.scale + radio <= 0.2 // 最小缩小倍数
            ? 0.2
            : this.state.scale + radio;

        this.bpmnModeler.get('canvas').zoom(newScale);
        this.setState({
            scale: newScale,
        });
    };

    // 渲染 xml 格式
    renderDiagram = xml => {
        this.bpmnModeler.importXML(xml, err => {
            if (err) {
                notification.error({
                    message: '提示',
                    description: '导入失败',
                });
            }
        });
    };

    // 预览图片
    handlePreview = () => {
        this.bpmnModeler.saveSVG({format: true}, (err, data) => {
            this.setState({
                svgSrc: data,
                svgVisible: true,
            });
        });
    };

    // 折叠
    handlePanelFold = () => {
        const {hidePanel} = this.state;
        this.setState(
            {
                hidePanel: !hidePanel,
                hideCount: 1,
            },
            () => {}
        );
    };

    // 返回列表
    handleBack() {
        router.push('/bpmn/processManage');
    }

    // 关闭流程图弹窗
    handleCancel = () => {
        this.setState({
            svgSrc: '',
            svgVisible: false,
        });
    };

    render() {
        const {loading} = this.props;
        const {hidePanel, hideFold, hideCount, svgVisible, svgSrc} = this.state;

        return (
            <PageHeaderWrapper title="流程设计" contentstyle={{height: 'calc(100% - 100px)'}}>
                <Card
                    bordered={false}
                    style={{width: '100%', height: '100%'}}
                    bodyStyle={{height: '100%'}}
                >
                    <div className={styles.container} id="js-drop-zone">
                        <div className={styles.canvas} id="canvas" />
                        <div
                            className={`properties-panel-fold
                                ${hideCount === 1 ? (hidePanel ? 'fold' : '') : ''}
                                ${hideCount === 1 ? (hideFold ? 'hide' : '') : ''}
                            `}
                            id="js-panel-fold"
                            title="折叠"
                            onClick={this.handlePanelFold}
                        />
                        <div
                            className={`properties-panel-parent ${
                                hideCount === 1 ? (hidePanel ? 'hidePanel' : 'showPanel') : ''
                            }`}
                            id="properties-panel"
                            style={{height: '100%'}}
                        />
                        <EditingTools
                            onOpenFIle={this.handleOpenFile}
                            // onSave={this.handleSave}
                            onUndo={this.handleUndo}
                            onRedo={this.handleRedo}
                            onDownloadSvg={this.handleDownloadSvg}
                            onDownloadXml={this.handleDownloadXml}
                            onZoomIn={() => this.handleZoom(0.1)}
                            onZoomOut={() => this.handleZoom(-0.1)}
                            onZoomReset={() => this.handleZoom()}
                            onPreview={this.handlePreview}
                        />
                    </div>
                </Card>

                {/* 查看流程图弹窗 */}
                {svgVisible && (
                    <FullModal visible={svgVisible} onCancel={this.handleCancel}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: svgSrc,
                            }}
                        />
                    </FullModal>
                )}
                <FooterToolbar>
                    <Button onClick={this.handleBack}>返回</Button>
                    <Button type="primary" loading={loading} onClick={this.handleSave}>
                        保存
                    </Button>
                </FooterToolbar>
            </PageHeaderWrapper>
        );
    }
}

export default ProcessDesign;
