import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

// const roleArr = [
//     { name: '业务专员', value: 'JJZY' },
//     { name: '银行客户经理', value: 'KHJINGL' },
//     { name: 'GPS厂商', value: 'gps' }
// ];

// const userArr = [
//     { name: '张三', value: '1' },
//     { name: '李四', value: '2' },
//     { name: '王五', value: '3' }
// ];

function getSelect(element, node) {
    const bo = getBusinessObject(element);
    const selectedOption = bo.get(node);
    return selectedOption;
}

function setSelect(element, value, name) {
    const obj = {};
    obj[`camunda:${name}`] = value[name];
    return obj;
}

export default function(group, element, bpmnFactory, translate) {
    if (!is(element, 'bpmn:UserTask')) return;
    const flowOptions = JSON.parse(window.sessionStorage.getItem('flowOptions'));

    // 节点属性
    const belong = entryFactory.selectBox({
        id: 'node_belong',
        label: translate('节点所属'),
        // selectOptions: flowOptions.node_belong,
        selectOptions: [{name: '请选择', value: ''}].concat(flowOptions.node_belong),
        modelProperty: 'node_belong',
        get(el) {
            return {
                node_belong: getSelect(el, 'camunda:node_belong'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'node_belong');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
        validate: function(element, values) {
            let validationResult = {};

            if (!values.node_belong) {
                validationResult.node_belong = '请选择节点所属';
            }

            return validationResult;
        },
    });

    group.entries.push(belong);

    // 节点类型
    const type = entryFactory.selectBox({
        id: 'node_type',
        label: translate('节点类型'),
        // selectOptions: flowOptions.node_type,
        selectOptions: [{name: '请选择', value: ''}].concat(flowOptions.node_type),
        modelProperty: 'node_type',
        get(el) {
            return {
                node_type: getSelect(el, 'camunda:node_type'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'node_type');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
        validate: function(element, values) {
            let validationResult = {};

            if (!values.node_type) {
                validationResult.node_type = '请选择节点类型';
            }

            return validationResult;
        },
    });

    group.entries.push(type);

    // 用户任务执行角色
    const role = entryFactory.selectBox({
        id: 'candidateGroups',
        label: translate('候选角色'),
        // selectOptions: flowOptions.roles,
        selectOptions: [{name: '请选择', value: ''}].concat(flowOptions.roles),
        modelProperty: 'candidateGroups',
        get(el) {
            return {
                candidateGroups: getSelect(el, 'camunda:candidateGroups'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'candidateGroups');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
        validate: function(element, values) {
            let validationResult = {};

            if (!values.candidateGroups) {
                validationResult.candidateGroups = '请选择候选角色';
            }

            return validationResult;
        },
    });

    group.entries.push(role);

    // 用户任务执行人
    const user = entryFactory.selectBox({
        id: 'candidateUsers',
        label: translate('候选用户'),
        // selectOptions: flowOptions.users,
        selectOptions: [{name: '请选择', value: ''}].concat(flowOptions.users),
        modelProperty: 'candidateUsers',
        get(el) {
            return {
                candidateUsers: getSelect(el, 'camunda:candidateUsers'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'candidateUsers');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
        validate: function(element, values) {
            let validationResult = {};

            if (!values.candidateUsers) {
                validationResult.candidateUsers = '请选择候选用户';
            }

            return validationResult;
        },
    });

    group.entries.push(user);
}
