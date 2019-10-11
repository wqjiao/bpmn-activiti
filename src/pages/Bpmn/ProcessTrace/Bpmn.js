import React, {Component, Fragment} from 'react';
import BpmnViewer from 'bpmn-js';
import {diagramXML} from './xml';
import './Bpmn.css';

class Bpmn extends Component {
    componentDidMount() {
        const {callback} = this.props;
        let viewer = new BpmnViewer({
            container: '#canvas',
            // height: 400
        });

        viewer.importXML(diagramXML, function(err) {
            if (err) {
                console.error('failed to load diagram');
                console.error(err);
                return console.log('failed to load diagram', err);
            }
            // diagram is loaded, add interaction to it
            // Option 1:
            // directly hook into internal diagram events
            // this allows you to access the clicked element directly
            let eventBus = viewer.get('eventBus');
            // you may hook into any of the following events
            let events = [
                // 'element.hover',
                // 'element.out',
                'element.click',
                // 'element.dblclick',
                // 'element.mousedown',
                // 'element.mouseup'
            ];
            events.forEach(function(event) {
                eventBus.on(event, function(e) {
                    // e.element = the model element
                    // e.gfx = the graphical element
                    console.log(event, 'on', e.element.id);
                    callback(e.element.id); // 流程图点击回调
                });
            });
            // Option 2:
            // directly attach an event listener to an elements graphical representation
            // each model element a data-element-id attribute attached to it in HTML
            // select the end event
            // let endEventNode = document.querySelector('#js-canvas [data-element-id=END_EVENT]');
            // endEventNode.addEventListener('click', function(e) {
            //     alert('clicked the end event!');
            // });
            // 删除 bpmn logo
            const bjsIoLogo = document.querySelector('.bjs-powered-by');
            while (bjsIoLogo.firstChild) {
                bjsIoLogo.removeChild(bjsIoLogo.firstChild);
            }
        });
    }

    render() {
        const {data} = this.props;
        return (
            <Fragment>
                <div id="canvas" style={{height: '100%'}} />
                <div>{data.id}</div>
            </Fragment>
        );
    }
}

export default Bpmn;
