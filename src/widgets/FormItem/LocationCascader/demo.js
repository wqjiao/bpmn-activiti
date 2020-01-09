/*
 * @Author: wqjiao
 * @Date: 2019-04-08 09:18:40
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-07-16 10:16:02
 * @Description: LocationCascader 地区级联
<LocationCascader
    locations={locations} // 省
    isChooseCity={true} // true --市； false -- 区
    labelText={arrJoinStr(arrayDesc, '/')} // 地区文本
    dispatch={dispatch} // dispatch
>
 */
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {Input} from 'antd';
import {addIsLeaf} from '@/utils/funcUtils';
import styles from './index.less';

class LocationCascader extends PureComponent {
    // static getDerivedStateFromProps(nextProps, nextState) {
    //     // Should be a controlled component.
    //     if ('value' in nextProps || 'labelText' in nextProps) {
    //         console.log(nextState.labelText, '-', nextProps.labelText)
    //         return {
    //             value: nextState.value || nextProps.value,
    //             labelText: nextState.labelText || nextProps.labelText,
    //         };
    //     }
    //     return null;
    // }

    constructor(props) {
        super(props);

        this.state = {
            values: props.value || [],
            labelText: props.labelText || '', // 选中的文本内容
            provinces:
                props.value.length > 0
                    ? this.handleTranslateData(props.locations, props.value[0])
                    : props.locations, // 省
            citys: [], // 市
            regions: [], // 区
            provinceName: '', // 选中的省 name
            cityName: '', // 选中的市 name
            provinceId: '', // 选中的省 id
            cityId: '', // 选中的市 id
            menuVisible: false, // 下拉框是否显示
            style: {},
            isFirst: true, // 初次进入页面
        };
    }

    componentDidUpdate() {
        const {value, labelText} = this.props;

        // 初次更新数据时，使用 props
        if (this.state.isFirst && labelText) {
            this.setState({
                isFirst: false,
                labelText,
                values: value,
            });
        }
    }

    componentDidMount() {
        let me = this,
            initValue = this.state.values;

        if (initValue && initValue.length > 0) {
            me.setState({
                provinceId: initValue[0] || '', // 选中的省 id
                cityId: initValue[1] || '', // 选中的市 id
                regionId: initValue[2] || '', // 选中的区 id
            });
        }
        // 隐藏下拉框
        this._onBlurHandler(me);
    }

    componentWillUnmount() {
        let me = this;

        // 卸载 body 上绑定的指定事件
        document.body.removeEventListener('click', e => me.clickFunction(me, e), false);
        // 手机端 touchend
        document.body.removeEventListener('touchend', e => me.clickFunction(me, e), false);
    }

    // 点击该组件其他区域时，隐藏下拉框
    _onBlurHandler(me) {
        document.body.addEventListener('click', e => me.clickFunction(me, e), false);
        // 手机端 touchend
        document.body.addEventListener('touchend', e => me.clickFunction(me, e), false);
    }

    // 监听 document.body 点击事件
    clickFunction = (me, e) => {
        // 针对不同浏览器的解决方案
        function matchesSelector(element, selector) {
            if (element.matches) {
                return element.matches(selector);
            } else if (element.matchesSelector) {
                return element.matchesSelector(selector);
            } else if (element.webkitMatchesSelector) {
                return element.webkitMatchesSelector(selector);
            } else if (element.msMatchesSelector) {
                return element.msMatchesSelector(selector);
            } else if (element.mozMatchesSelector) {
                return element.mozMatchesSelector(selector);
            } else if (element.oMatchesSelector) {
                return element.oMatchesSelector(selector);
            }
        }
        // 匹配当前组件内的所有元素
        if (
            matchesSelector(e.target, '.xinhang-widgets-location-cascader-index-locationCascader *')
        ) {
            return;
        }

        // 判断 下拉框是否显示
        if (me.state.menuVisible) {
            me.setState({
                menuVisible: false,
            });
        }
    };

    // 生成子菜单 menu
    renderCascaderMenu = (type, data) => {
        if (!data || (data && data.length < 1)) return null;
        return (
            <ul className={styles.cascaderMenu}>
                {data.map(item => {
                    let hasLeafKey = item.hasOwnProperty('isLeaf'); // 存在向有的箭头
                    return (
                        <li
                            className={classNames(styles.cascaderMenuItem, {
                                [styles.cascaderMenuItemExpand]: hasLeafKey,
                                [styles.cascaderMenuItemActive]: item.active,
                            })}
                            onClick={e => this.handleMenuItemClick(type, item, e)}
                            key={`${item.label}-${item.value}`}
                        >
                            {item.label}
                            {hasLeafKey ? this.renderRightIcon() : null}
                        </li>
                    );
                })}
            </ul>
        );
    };

    // 生成子菜单中的右侧 icon
    renderRightIcon = () => {
        return (
            <span className={styles.menuItemIcon}>
                <i aria-label="图标: right" className="anticon anticon-right">
                    <svg
                        viewBox="64 64 896 896"
                        data-icon="right"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z" />
                    </svg>
                </i>
            </span>
        );
    };

    // 点击显示 下拉框
    handleClick = e => {
        e.preventDefault();
        e.stopPropagation();
        let me = this;

        me.setState({
            menuVisible: !me.state.menuVisible,
        });
    };

    // 添加选中标记
    handleTranslateData(data, value) {
        return data.map(item => {
            if (item.value === value) {
                item = {
                    ...item,
                    active: true,
                };
            } else {
                delete item.active;
            }
            return item;
        });
    }

    /**
     * @method 省市区 子菜单点击事件
     * @param [String] type 对应省市区 类型
     * @param [Object] item 对应省市区 key/value
     */
    handleMenuItemClick = (type, item, e) => {
        e.preventDefault();
        e.stopPropagation();
        let me = this,
            target = e.currentTarget.parentNode;
        const {
            state: {provinces, citys, regions, provinceName, cityName, provinceId, cityId},
            props: {dispatch, isChooseCity},
        } = this;

        // 省 -- 获取对应市,并踢出同一个字段
        if (type === 'province') {
            dispatch({
                type: 'location/getCitys',
                payload: {
                    query: {
                        provinceId: item.value,
                    },
                },
                callback: data => {
                    me.setState(
                        {
                            provinceName: item.label,
                            provinceId: item.value,
                            regions: [],
                            citys: isChooseCity ? data : addIsLeaf(data),
                            provinces: this.handleTranslateData(provinces, item.value),
                        },
                        function() {
                            me.changeSelectOffset(target);
                        }
                    );
                },
            });
        }
        // 市 -- 获取对应区
        if (type === 'city') {
            // 只选择到市
            if (isChooseCity) {
                me.setState({
                    labelText: `${provinceName}/${item.label}`,
                    menuVisible: false,
                    citys: this.handleTranslateData(citys, item.value),
                });
                this.triggerChange([provinceId, item.value]);
            } else {
                dispatch({
                    type: 'location/getRegions',
                    payload: {
                        query: {
                            cityId: item.value,
                        },
                    },
                    callback: data => {
                        me.setState(
                            {
                                cityName: item.label,
                                cityId: item.value,
                                regions: data,
                                citys: this.handleTranslateData(citys, item.value),
                            },
                            function() {
                                me.changeSelectOffset(target);
                            }
                        );
                    },
                });
            }
        }
        // 区 -- 赋值
        if (type === 'region') {
            me.setState({
                labelText: `${provinceName}/${cityName}/${item.label}`,
                menuVisible: false,
                regionId: item.value,
                regions: this.handleTranslateData(regions, item.value),
            });
            this.triggerChange([provinceId, cityId, item.value]);
        }
    };

    /**
     * @method 修改 下拉框位置
     * @param {*} target 当前触发的元素
     */
    changeSelectOffset(target) {
        const width = document.body.clientWidth - target.nextSibling.getBoundingClientRect().right;

        if (width < 0) {
            this.setState({
                style: {right: '0'},
            });
        }
    }

    // 更新 Form 表单对应 value
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            // console.log('Object: ', changedValue);
            onChange(changedValue);
        }
    };

    // 清空数据
    handleClearLabel = () => {
        this.setState({
            labelText: '',
            provinceId: '',
            cityId: '',
            regionId: '',
            provinces: this.props.locations,
            citys: [],
            regions: [],
            menuVisible: false,
        });
        this.triggerChange([]);
    };

    render() {
        const {menuVisible, labelText, provinces, citys, regions, style} = this.state;

        return (
            <div className={styles.locationCascader}>
                <span className={styles.locationPicker} title={labelText}>
                    <span className={styles.cascaderLabel}>{labelText}</span>
                    <Input
                        className={styles.cascaderInput}
                        placeholder={labelText ? '' : '请选择'}
                        readOnly
                        autoComplete="off"
                        type="text"
                        value=""
                        onClick={this.handleClick}
                    />
                    {/* 清空选中的地址数据 */}
                    {labelText && (
                        <i
                            aria-label="图标: close-circle"
                            className={styles.closeCircle}
                            onClick={this.handleClearLabel}
                        >
                            <svg
                                viewBox="64 64 896 896"
                                data-icon="close-circle"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
                            </svg>
                        </i>
                    )}
                    {/* 上下箭头 */}
                    <i
                        aria-label="图标: down"
                        className={classNames(styles.cascaderIcon, {
                            [styles.cascaderIconExpand]: menuVisible,
                        })}
                    >
                        <svg
                            viewBox="64 64 896 896"
                            data-icon="down"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
                        </svg>
                    </i>
                </span>
                {/* 省市区 下拉数据 */}
                <div
                    className={classNames(styles.cascaderMenus, {
                        [styles.menusHidden]: !menuVisible,
                    })}
                    style={style}
                >
                    {/* 省 */}
                    {this.renderCascaderMenu('province', provinces)}
                    {/* 市 */}
                    {this.renderCascaderMenu('city', citys)}
                    {/* 区 */}
                    {this.renderCascaderMenu('region', regions)}
                </div>
            </div>
        );
    }
}

export default LocationCascader;
