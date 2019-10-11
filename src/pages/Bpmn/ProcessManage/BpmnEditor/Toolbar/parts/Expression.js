import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

const CONDITIONAL_SOURCES = [
    'bpmn:Activity',
    'bpmn:ExclusiveGateway',
    'bpmn:InclusiveGateway',
    'bpmn:ComplexGateway',
];

function isConditionalSource(element) {
    return isAny(element, CONDITIONAL_SOURCES);
}

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
    const bo = getBusinessObject(element);

    if (!bo) return;

    const conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(element);

    if (
        !(is(element, 'bpmn:SequenceFlow') && isConditionalSource(element.source)) &&
        !conditionalEventDefinition
    ) {
        return;
    }

    const flowOptions = JSON.parse(window.sessionStorage.getItem('flowOptions'));

    // 变量
    const variate = entryFactory.selectBox({
        id: 'condition',
        label: translate('字段'),
        selectOptions: flowOptions.condition,
        modelProperty: 'condition',
        get(el) {
            return {
                condition: getSelect(el, 'camunda:condition'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'condition');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
    });

    group.entries.push(variate);
    // 变量
    const equality = entryFactory.selectBox({
        id: 'opt',
        label: translate('关联关系'),
        selectOptions: flowOptions.rule_operator,
        modelProperty: 'opt',
        get(el) {
            return {
                opt: getSelect(el, 'camunda:opt'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'opt');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
    });

    group.entries.push(equality);

    // 变量
    const value = entryFactory.textField({
        id: 'value',
        label: translate('金额'),
        modelProperty: 'value',
        validate: function(element, values) {
            let validationResult = {};

            if (!values.value) {
                validationResult.value = '须提供一个值';
            }

            return validationResult;
        },
        get(el) {
            return {
                value: getSelect(el, 'camunda:value'),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value, 'value');
            return cmdHelper.updateBusinessObject(element, bo, props);
        },
    });

    group.entries.push(value);

    // 表达式
    const html = entryFactory.textField({
        id: 'expression',
        label: translate('表达式'),
        modelProperty: 'expression',
        disabled: () => {
            return true;
        },
        get(el) {
            let condition = getSelect(el, 'camunda:condition') || '';
            let opt = getSelect(el, 'camunda:opt') || '';
            let value = getSelect(el, 'camunda:value') || '';
            return {
                expression: `${condition}${opt}${value}`,
            };
        },
    });

    group.entries.push(html);
}
