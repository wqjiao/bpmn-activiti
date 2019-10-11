import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import {query, domify, attr} from 'min-dom/dist';
import {forEach} from 'lodash/collection';

function getData(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms, {val: 1});
    });
}

function getSelectBox(node) {
    return query('select[name=dynamicSelect]', node.parentElement);
}

function getSelect(element) {
    const bo = getBusinessObject(element);
    const selectedOption = bo.get('camunda:dynamicSelect');

    return selectedOption;
}

function setSelect(element, value) {
    const obj = {};
    obj['camunda:dynamicSelect'] = value.dynamicSelect;

    return obj;
}

export default function(group, element) {
    const selectGroup = {
        id: 'dynamicSelect',
        html:
            '<div class="bpp-row bpp-select">' +
            '<label for="dynamic-select">动态获取列表</label>' +
            '<div class="bpp-field-wrapper">' +
            '<select id="dynamic-select" name="dynamicSelect" data-value>' +
            '</select>' +
            '<button class="get-data" id="addElement" data-action="addElement">获取数据</button>' +
            '</div>' +
            '</div>',
        get(el) {
            return {
                dynamicSelect: getSelect(el),
            };
        },
        set(el, value) {
            const bo = getBusinessObject(el);
            const props = setSelect(el, value);

            return cmdHelper.updateBusinessObject(element, bo, props);
        },
        addElement(el, inputNode) {
            getData(1000).then(value => {
                console.log('调用成功', value);

                const selectBox = getSelectBox(inputNode);

                forEach(selectBox, () => {
                    selectBox.removeChild(selectBox.firstChild);
                });

                for (let i = 0; i < 10; i += 1) {
                    const optionTemplate = domify(`<option value="${i}">${i}</option>`);
                    selectBox.insertBefore(optionTemplate, selectBox.firstChild);
                }

                forEach(selectBox, option => {
                    if (option.value === 0) {
                        attr(option, 'selected', 'selected');
                    } else {
                        attr(option, 'selected', null);
                    }
                });

                return true;
            });
        },
    };

    group.entries.push(selectGroup);
}
