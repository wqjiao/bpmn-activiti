import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {is} from 'bpmn-js/lib/util/ModelUtil';

export default function(group, element, bpmnFactory, translate) {
    if (!is(element, 'bpmn:SequenceFlow')) return;

    group.entries.push(
        entryFactory.textField({
            id: 'condition',
            label: translate('Condition'),
        })
    );
}
