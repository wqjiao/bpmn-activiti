import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

// const options = [
//     { name: '业务管理', value: '1' },
//     { name: '车辆管理', value: '2' },
//     { name: '抵押放款', value: '3' }
// ];

function getSelect(element) {
    const bo = getBusinessObject(element);
    const selectedOption = bo.get('camunda:NodeType');

    return selectedOption;
}

function setSelect(element, value) {
    const obj = {};
    obj['camunda:NodeType'] = value.NodeType;

    return obj;
}

export default function(group, element, bpmnFactory, translate) {
    const flowOptions = JSON.parse(window.sessionStorage.getItem('flowOptions'));

    const selectGroup = entryFactory.selectBox({
        id: 'NodeType',
        label: translate('节点所属'),
        selectOptions: flowOptions.NodeType,
        modelProperty: 'NodeType',
        get(el) {
            return {
                customSelect: getSelect(el),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value);

            return cmdHelper.updateBusinessObject(element, bo, props);
        },
    });

    group.entries.push(selectGroup);
}
