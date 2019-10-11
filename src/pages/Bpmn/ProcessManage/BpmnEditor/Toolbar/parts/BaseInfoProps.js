import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

// 编号
export default function(group, element, bpmnFactory, translate) {
    group.entries.push(
        entryFactory.textField({
            id: 'id',
            label: translate('编号'),
            modelProperty: 'id',
        })
    );

    group.entries.push(
        entryFactory.textField({
            id: 'name',
            label: translate('名称'),
            modelProperty: 'name',
            validate: function(element, values) {
                let validationResult = {};

                if (!values.name) {
                    validationResult.name = '请输入节点名称';
                }

                if (values.name && values.name.length > 30) {
                    validationResult.name = '名称最多30个字';
                }

                return validationResult;
            },
        })
    );
}
