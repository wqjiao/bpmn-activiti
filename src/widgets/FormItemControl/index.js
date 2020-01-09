/*
 * @Author: wqjiao
 * @Date: 2019-08-02 18:42:08
 * @Last Modified by: wqjiao
 * @Last Modified time: 2020-01-09 10:47:09
 * @Description: 动态配置表单：输入方式、必选填、长度
 */
import React, {PureComponent} from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Radio,
    Checkbox,
    DatePicker,
    Select,
    Cascader,
} from 'antd';
import moment from 'moment';
import AntdSelect from '@/widgets/AntdSelect';
import CarSelect from '@/widgets/CarSelect';
import LocationCascader from '@/widgets/LocationCascader';
import PlainText from '@/widgets/FormItem/PlainText';
import DoubleNumber from '@/widgets/FormItem/DoubleNumber';
import TextInputNumber from '@/widgets/FormItem/TextInputNumber';
import LongTermPicker from '@/widgets/FormItem/LongTermPicker';
import LongRangePicker from '@/widgets/FormItem/LongRangePicker';
import FixedTelephone from '@/widgets/FormItem/FixedTelephone';
import {
    addIsLeaf,
    limitDecimals,
    inputNumber,
    arrJoinStr,
    getPhoneValue,
    getIdentityValue,
} from '@/utils/funcUtils';
import {MobileReg, IdentityReg} from '@/utils/constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;
const {Option} = Select;
const inputTypes = [
    'TextArea',
    'Input',
    'InputPhone',
    'InputTelephone',
    'InputIdentity ',
    'InputIntNumber',
    'InputFloatNumber',
    'InputNumber',
    'DoubleNumber',
    'TextInputNumber',
];
const dateFormat = 'YYYY-MM-DD';

class FormItemControl extends PureComponent {
    // 前者数值不能大于后者数值
    validatorRules(required, limit, rule, value, callback) {
        if (value && value.length > 0) {
            // 用户做了输入操作
            if (required && (value.length < 2 || !(value[0] + ''))) {
                callback('请输入相应数值');
            }
            if (value[0] > value[1]) {
                callback('下限数值不能大于上限数值');
            }
            if (limit.length === 2) {
                if (value[0] < limit[0] || value[1] < limit[0]) {
                    callback(`比例不能低于${limit[0]}`);
                }
                if (value[0] > limit[1] || value[1] > limit[1]) {
                    callback(`比例不能超过${limit[1]}`);
                }
            }
        }

        callback();
    }

    /**
     * @method 日期选择控制
     * @param {*} [current] 日期
     * @param {String} dateType 判断今天之前之后
     * @param {Number} dateLength 之前之后天数
     */
    disabledDate = (current, dateType, dateLength) => {
        // 仅选择今天之前的日期
        if (dateType === 'before') {
            // 往前推 dateLength 天
            if (dateLength) {
                return current > moment().subtract(dateLength, 'days');
            }
            return current && current > moment().endOf('day');
        } else if (dateType === 'after') {
            // 往后推 dateLength 天
            if (dateLength) {
                return current < moment().add(dateLength, 'days');
            }
            return current && current < moment().endOf('day');
        }
    };

    // 校验整数/浮点数数字:长度或者上下限
    validatorNumber(validator, rule, value, callback) {
        // 上下限、name、最大长度、最大值
        const {limit, fieldName, numberLength, maxValue} = validator;

        if (limit.length === 2 && (value < limit[0] || value > limit[1])) {
            callback(`${fieldName}需在${limit[0]}-${limit[1]}范围内！`);
        } else if (numberLength && value > maxValue) {
            callback(`${fieldName}不能超过${maxValue}！`);
        } else if (value < 0) {
            callback(`${fieldName}不能小于0！`);
        }

        callback();
    }

    // 渲染 FormItem
    renderFormItemChild() {
        const {
            formData,
            dispatch,
            form: {getFieldDecorator},
            formItemOptions = {rules: [], getValueFromEvent: null},
            carType, // 车辆类型
            onInputChange = () => {}, // Input/InputNumber onChange 事件
            addonAfter = '', // Input 后置标签
            limitLength = 8, // 固定电话位数限制
        } = this.props;
        let itemChild = '',
            {
                fieldName,
                name,
                formType,
                fieldValue,
                fieldCodes,
                dictList = [],
                validateType,
                detail,
            } = formData;
        const isInput = inputTypes.includes(formType);
        let {notNull, canEdit = true, maxLength, limit = [], dateType, dateLength} = validateType;

        limit = limit || [].map(item => parseFloat(item));
        dictList = dictList || []; // 判断数组是否有值
        notNull = notNull ? true : false;
        canEdit = canEdit ? true : false;

        // 地区选择器+详情
        if (formType === 'CascaderInput') {
            if (!detail || !detail.name) {
                formType = 'Cascader';
            } else {
                return this.renderCascader();
            }
        }

        // 是否必填规则
        let requiredRule = [];
        if (formType === 'Input') {
            requiredRule.push({
                required: notNull,
                whitespace: true,
                message: `请输入${fieldName}`,
            });
        } else {
            requiredRule.push({
                required: notNull,
                message: isInput ? `请输入${fieldName}` : `请选择${fieldName}`,
            });
        }
        // 文本输入框最大长度提示
        let maxLengthRule = [];
        if (formType === 'TextArea' || formType === 'Input') {
            maxLengthRule.push({
                max: maxLength || null,
                message: `${fieldName}不能超过${maxLength}位！`,
            });
        }

        // 表单其他参数配置
        const options = {
            initialValue: fieldValue,
            rules: [...requiredRule, ...maxLengthRule, ...formItemOptions.rules],
            getValueFromEvent: formItemOptions.getValueFromEvent || null,
        };

        // 数字输入框最大长度:表示最大整数位
        let intLength = maxLength || 7; // 整数最大长度
        const floatLength = maxLength ? maxLength - 2 : 7; // 小数的整数位最大长度

        switch (formType) {
            case 'PlainText':
                itemChild = <PlainText value={fieldValue} />;
                break;
            case 'Text':
                itemChild = getFieldDecorator(name, {initialValue: fieldValue})(<PlainText />);
                break;
            case 'TextArea':
                itemChild = getFieldDecorator(name, options)(
                    <TextArea disabled={!canEdit} placeholder="请输入" autosize />
                );
                break;
            case 'Input': {
                itemChild = getFieldDecorator(name, options)(
                    <Input
                        placeholder="请输入"
                        disabled={!canEdit}
                        onChange={e => onInputChange(e.target.value)}
                        addonAfter={addonAfter}
                        maxLength={maxLength || null}
                    />
                );
                break;
            }
            case 'InputPhone': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            len: 11,
                            pattern: new RegExp(MobileReg, 'g'),
                            message: `请正确输入${fieldName}`,
                        },
                    ],
                    getValueFromEvent: e => getPhoneValue(e),
                })(<Input placeholder="请输入" maxLength={11} disabled={!canEdit} />);
                break;
            }
            case 'InputTelephone': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            pattern: new RegExp(`^0\\d{2,3}-\\d{7,${limitLength}}$`, 'g'),
                            message: `请正确输入${fieldName}`,
                        },
                    ],
                })(
                    <FixedTelephone placeholder="请输入" disabled={!canEdit} length={limitLength} />
                );
                break;
            }
            case 'InputIdentity': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            pattern: new RegExp(IdentityReg, 'g'),
                            message: '请正确输入18位证件号码',
                        },
                    ],
                    getValueFromEvent: e => getIdentityValue(e),
                })(<Input placeholder="请输入" maxLength={18} disabled={!canEdit} />);
                break;
            }
            case 'InputNumber':
                itemChild = getFieldDecorator(name, options)(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={value => inputNumber(value)}
                        parser={value => inputNumber(value)}
                        maxLength={maxLength || null}
                        onChange={onInputChange}
                    />
                );
                break;
            case 'InputIntNumber': {
                const maxValue = Math.pow(10, intLength) - 1;
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            validator: this.validatorNumber.bind(this, {
                                limit,
                                fieldName,
                                numberLength: intLength,
                                maxValue,
                            }),
                        },
                    ],
                })(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={inputNumber}
                        parser={inputNumber}
                        maxLength={intLength}
                        disabled={!canEdit}
                        onChange={onInputChange}
                        max={maxValue}
                    />
                );
                break;
            }
            case 'InputFloatNumber': {
                const maxValue = Math.pow(10, floatLength) - 0.01;
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            validator: this.validatorNumber.bind(this, {
                                limit,
                                fieldName,
                                numberLength: floatLength,
                                maxValue,
                            }),
                        },
                    ],
                })(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={value => limitDecimals(value, floatLength)}
                        parser={value => limitDecimals(value, floatLength)}
                        maxLength={floatLength + 3}
                        disabled={!canEdit}
                        onChange={onInputChange}
                        max={maxValue}
                    />
                );
                break;
            }
            case 'TextInputNumber':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            validator: this.validatorNumber.bind(this, {
                                limit,
                                fieldName,
                                numberLength: maxLength || 7,
                                maxValue: Math.pow(10, maxLength) - 1,
                            }),
                        },
                    ],
                })(<TextInputNumber data={dictList} validateType={validateType} />);
                break;
            case 'DoubleNumber': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {validator: this.validatorRules.bind(this, notNull, limit)},
                    ],
                })(<DoubleNumber limit={limit || []} />);
                break;
            }
            case 'Select': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue:
                        fieldCodes && fieldCodes.length > 0 ? fieldCodes.join(',') : undefined,
                })(
                    <AntdSelect
                        data={dictList}
                        name={name}
                        disabled={!canEdit}
                        onChange={value => this.handleSelect(value, name)}
                    />
                );
                break;
            }
            case 'CascaderSelect':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <Cascader placeholder="请选择" options={dictList} />
                );
                break;
            case 'Cascader':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <LocationCascader
                        locations={addIsLeaf(dictList)}
                        dispatch={dispatch}
                        isChooseCity={formData.isCity}
                        labelText={arrJoinStr(fieldValue, '/')}
                        disabled={!canEdit}
                        onRef={this.props.onRef || null}
                    />
                );
                break;
            case 'Radio':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue:
                        fieldCodes && fieldCodes.length > 0 ? fieldCodes.join(',') : undefined,
                })(
                    <RadioGroup disabled={!canEdit}>
                        {dictList.map(item => {
                            return (
                                <Radio value={item.value} key={`${name}-${item.value}`}>
                                    {item.label}
                                </Radio>
                            );
                        })}
                    </RadioGroup>
                );
                break;
            case 'Checkbox':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <CheckboxGroup disabled={!canEdit} style={{width: '100%'}}>
                        <Row>
                            {dictList.map(item => {
                                return (
                                    <Checkbox
                                        value={item.value}
                                        disabled={item.disabled}
                                        key={`${name}-${item.value}`}
                                    >
                                        {item.label}
                                    </Checkbox>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>
                );
                break;
            case 'DatePicker':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue: fieldValue ? moment(fieldValue, dateFormat) : undefined,
                })(
                    <DatePicker
                        format={dateFormat}
                        disabled={!canEdit}
                        onChange={value => this.handleSelect(value, name)}
                        style={{width: '100%'}}
                        disabledDate={current => this.disabledDate(current, dateType, dateLength)}
                    />
                );
                break;
            case 'LongTermPicker':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue: fieldValue ? moment(fieldValue, dateFormat) : undefined,
                })(
                    <LongTermPicker
                        disabled={!canEdit}
                        disabledDate={current => this.disabledDate(current, dateType, dateLength)}
                    />
                );
                break;
            case 'RangePicker': {
                fieldValue =
                    fieldValue && fieldValue.length > 0
                        ? [moment(fieldValue[0], dateFormat), moment(fieldValue[1], dateFormat)]
                        : undefined;
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldValue})(
                    <RangePicker format={dateFormat} disabled={!canEdit} style={{width: 'auto'}} />
                );
                break;
            }
            case 'LongRangePicker': {
                fieldValue =
                    fieldValue && fieldValue.length > 0
                        ? [moment(fieldValue[0], dateFormat), moment(fieldValue[1], dateFormat)]
                        : undefined;
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldValue})(
                    <LongRangePicker disabled={!canEdit} />
                );
                break;
            }
            case 'SelectVehicle': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue: fieldCodes && fieldCodes.length > 0 ? fieldCodes.join(',') : [],
                })(
                    carType ? (
                        <CarSelect
                            inputValue={fieldValue}
                            changeCarSelect={value => this.handleSelect(value, name)}
                            carType={carType}
                            dispatch={dispatch}
                            onRef={this.props.onRef || null}
                        />
                    ) : (
                        <Select allowClear={true} placeholder="请选择" disabled={!canEdit}>
                            <Option key="carType" />
                        </Select>
                    )
                );
                break;
            }
            default:
                itemChild = getFieldDecorator(name, options)(
                    <Input
                        placeholder="请输入"
                        maxLength={maxLength}
                        disabled={!canEdit}
                        onChange={e => onInputChange(e.target.value)}
                    />
                );
                break;
        }

        return <FormItem label={fieldName}>{itemChild}</FormItem>;
    }

    // 地区选择器+详情
    renderCascader = () => {
        const {
            dispatch,
            form: {getFieldDecorator},
            formData: {fieldName, name, dictList, fieldCodes, fieldValue, validateType, detail},
        } = this.props;
        let {notNull = false, canEdit = true, maxLength = 200} = validateType;

        notNull = notNull ? true : false;
        canEdit = canEdit ? true : false;

        const detailValidate = detail.validateType || {};
        const required = detailValidate.hasOwnProperty('notNull')
            ? !!detailValidate.notNull
            : false;
        const disabled = detailValidate.hasOwnProperty('canEdit') ? !detailValidate.canEdit : false;

        return (
            <Row gutter={{md: 8, lg: 24, xl: 24}}>
                <Col lg={10} xs={14}>
                    <FormItem label={fieldName}>
                        {getFieldDecorator(name, {
                            initialValue: fieldCodes || [],
                            rules: [
                                {
                                    required: notNull,
                                    message: `请选择${fieldName}`,
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (notNull && value.length > 0 && value.length < 3) {
                                            callback('请选择相应的省市区');
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <LocationCascader
                                locations={addIsLeaf(dictList)}
                                dispatch={dispatch}
                                labelText={arrJoinStr(fieldValue, '/')}
                                disabled={!canEdit}
                                onRef={this.props.onRef || null}
                            />
                        )}
                    </FormItem>
                </Col>
                {/* 存在detail时显示 */}
                {detail.name && (
                    <Col lg={14} xs={10}>
                        <FormItem>
                            {getFieldDecorator(detail.name, {
                                initialValue: detail.fieldValue ? detail.fieldValue + '' : '',
                                rules: [
                                    {
                                        required: required,
                                        whitespace: true,
                                        message: '请输入详细地址',
                                    },
                                    {
                                        max: maxLength || null,
                                        message: `详细地址不能超过${maxLength}位！`,
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="请输入"
                                    style={{width: '100%'}}
                                    disabled={disabled}
                                />
                            )}
                        </FormItem>
                    </Col>
                )}
            </Row>
        );
    };

    // 选拉框改变
    handleSelect = (value, name) => {
        const {handleSelect} = this.props;
        // 判断是否存在回调
        if (handleSelect) {
            handleSelect(value, name);
        }
    };

    render() {
        const {width} = this.props.formData;
        const spans = {1: 8, 1.5: 12, 2: 16, 3: 24}; // 栅格

        return (
            <Col xl={spans[width] || 8} sm={24} xs={24}>
                {this.renderFormItemChild()}
            </Col>
        );
    }
}

export default FormItemControl;
