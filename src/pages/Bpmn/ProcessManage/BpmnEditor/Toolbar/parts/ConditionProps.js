import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import {query} from 'min-dom';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';
import script from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Script';

let domQuery = query;

export default function(group, element, bpmnFactory, translate) {
    const bo = getBusinessObject(element);

    if (!bo) return;

    let conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(element);

    if (
        !(is(element, 'bpmn:SequenceFlow') && isConditionalSource(element.source)) &&
        !conditionalEventDefinition
    ) {
        return;
    }

    // let html = '', selectOptions = [{name: '111', value: '111'}];
    // if (selectOptions) {
    //     selectOptions.forEach(option => {
    //         html += '<option value="' + option.value + '">' + (option.name || '') + '</option>';
    //     });
    // }
    // {
    //    id: 'condition',
    //     label: translate('Condition'),
    //     html: `
    //         <div class="bpp-row">
    //             <label for="cam-condition-type">${translate('变量')}</label>
    //             <div class="bpp-field-wrapper">
    //                 <select id="cam-condition-type" name="conditionType" data-value>
    //                     <option value="" selected></option>
    //                     ${html}
    //                 </select>
    //             </div>
    //         </div>
    //         <div class="bpp-row">
    //             <label for="cam-condition-type">${translate('等式')}</label>
    //             <div class="bpp-field-wrapper">
    //                 <select id="cam-condition-equl" name="conditionEqul" data-value>
    //                     <option value="" selected></option>
    //                     ${html}
    //                 </select>
    //             </div>
    //         </div>
    //         <div class="bpp-row">
    //             <label for="cam-condition">${translate('金额')}</label>
    //             <div class="bpp-field-wrapper">
    //                 <input id="cam-condition-value" type="text" name="conditionValue" placeholder="请输入" />
    //                 <button class="clear" data-action="clear" data-show="canClear">
    //                     <span>X</span>
    //                 </button>
    //             </div>
    //         </div>
    //     `,
    // }

    group.entries.push({
        id: 'condition',
        label: translate('Condition'),
        html: `
            <div class="bpp-row">
                <label for="cam-condition">${translate('Expression')}</label>
                <div class="bpp-field-wrapper">
                    <input id="cam-condition" type="text" name="condition" placeholder="请输入" />
                    <button class="clear" data-action="clear" data-show="canClear">
                        <span>X</span>
                    </button>
                </div>
            </div>
        `,
        get: function(element) {
            let conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(
                element
            );

            let conditionExpression = conditionalEventDefinition
                ? conditionalEventDefinition.condition
                : bo.conditionExpression;
            let values = {};

            if (conditionExpression) {
                values.condition = conditionExpression.get('body');
            }

            return values;
        },
        set: function(element, values) {
            let commands = [];

            let conditionProps = {
                body: undefined,
            };

            conditionProps.body = values.condition;

            let conditionOrConditionExpression = elementHelper.createElement(
                'bpmn:FormalExpression',
                conditionProps,
                conditionalEventDefinition || bo,
                bpmnFactory
            );

            let source = element.source;

            // if default-flow, remove default-property from source
            if (source && source.businessObject.default === bo) {
                commands.push(cmdHelper.updateProperties(source, {default: undefined}));
            }

            let update = conditionalEventDefinition
                ? {condition: conditionOrConditionExpression}
                : {conditionExpression: conditionOrConditionExpression};

            commands.push(
                cmdHelper.updateBusinessObject(element, conditionalEventDefinition || bo, update)
            );

            return commands;
        },
        validate: function(element, values) {
            let validationResult = {};

            if (!values.condition) {
                validationResult.condition = '请输入表达式${表达式}';
            }

            return validationResult;
        },

        clear: function(element, inputNode) {
            // clear text input
            domQuery('input[name=condition]', inputNode).value = '';

            return true;
        },

        canClear: function(element, inputNode) {
            let input = domQuery('input[name=condition]', inputNode);

            return input.value !== '';
        },

        script: script,

        cssClasses: ['bpp-textfield'],
    });
}

let CONDITIONAL_SOURCES = [
    'bpmn:Activity',
    'bpmn:ExclusiveGateway',
    'bpmn:InclusiveGateway',
    'bpmn:ComplexGateway',
];

function isConditionalSource(element) {
    return isAny(element, CONDITIONAL_SOURCES);
}
