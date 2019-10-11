import inherits from 'inherits';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
// import conditionalProps from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ConditionalProps.js';

import baseInfo from './parts/BaseInfoProps';
// import gateWayProps from './parts/GateWayProps';
// import checkboxProps from './parts/CheckboxProps';
// import selectProps from './parts/SelectProps';
import userCustomProps from './parts/UserCustomProps';
// import Expression from './parts/Expression';
import ConditionProps from './parts/ConditionProps';

// 创建基础信息看板
function createBaseInfoTab(element, bpmnFactory, elementRegistry, translate) {
    const generalGroup = {
        id: 'baseInfo',
        label: '',
        entries: [],
    };

    baseInfo(generalGroup, element, bpmnFactory, translate);
    // gateWayProps(generalGroup, element, bpmnFactory, translate);
    userCustomProps(generalGroup, element, bpmnFactory, translate);
    // Expression(generalGroup, element, bpmnFactory, translate);
    ConditionProps(generalGroup, element, bpmnFactory, translate);
    // console.log('初始化属性看板');
    // conditionalProps(generalGroup, element, bpmnFactory, translate);
    return [generalGroup];
}

// // 创建变量属性看板, 预留选择节点类型
// function createVariableTab(element, bpmnFactory, elementRegistry, translate) {
//     const generalGroup = {
//         id: 'variableInfo',
//         label: '',
//         entries: []
//     };
//     selectProps(generalGroup, element, bpmnFactory, translate);

//     return [generalGroup];
// }

export default function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {
    PropertiesActivator.call(this, eventBus);
    this.getTabs = function(element) {
        const baseInfoTab = {
            id: 'baseInfo',
            label: '基本信息',
            groups: createBaseInfoTab(element, bpmnFactory, elementRegistry, translate),
        };

        // const variableTab = {
        //     id: 'variableInfo',
        //     label: '变量属性',
        //     groups: createVariableTab(element, bpmnFactory, elementRegistry, translate)
        // };

        return [baseInfoTab];
    };
}

inherits(MagicPropertiesProvider, PropertiesActivator);

MagicPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'elementRegistry', 'translate'];
