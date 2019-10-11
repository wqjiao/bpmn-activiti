import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

export default function(group, element, bpmnFactory, translate) {
    const checkboxGroup = entryFactory.checkbox({
        id: 'customCheckbox',
        label: translate('自定义复选框'),
        modelProperty: 'camunda:customCheckbox',
    });

    group.entries.push(checkboxGroup);
}
