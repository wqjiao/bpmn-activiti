/*
 * @Author: wqjiao
 * @Date: 2019-04-08 09:18:40
 * @Last Modified by: wqjiao
 * @Last Modified time: 2020-01-09 10:48:20
 * @Description: LocationCascader 地区级联
 * @Use 使用说明，以下必传项
    <LocationCascader
        dispatch={dispatch}
        locations={locations}
        labelText={''} // 地区中文字段
        value={[]} // form 对应 initialValue
    >
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Input, Icon} from 'antd';
import {addIsLeaf, activeSignData, matchesSelector} from '@/utils/funcUtils';
import AntdEmpty from '@/widgets/AntdEmpty';
import styles from './index.less';

class LocationCascader extends PureComponent {
    static propTypes = {
        value: PropTypes.array, // codes 数组
        labelText: PropTypes.string, // 中文数组
        locations: PropTypes.array, // 省数组
        isChooseCity: PropTypes.bool, // 默认选至区: true->市 false->区
        cityDisp: PropTypes.object, // 市接口，默认公共接口 {{ type: '', payload: {} }}
        regionDisp: PropTypes.object, // 区接口，默认公共接口 {{ type: '', payload: {} }}
        dispatch: PropTypes.func,
        onChange: PropTypes.func,
        onRef: PropTypes.func, // 可选，父组件通过 ref 调用 triggerChange 方法修改 labelText
        allowClear: PropTypes.bool, // 是否清空，默认支持清空
    };

    static defaultProps = {
        labelText: '',
        locations: [],
        isChooseCity: false,
        allowClear: true,
    };

    state = {
        values: [],
        labelText: '', // 选中的文本内容
        provinces: [], // 省
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

    static getDerivedStateFromProps(nextProps) {
        if ('locations' in nextProps) {
            const values = nextProps.value || [];
            const locations = nextProps.locations || [];

            return {
                provinces: values.length > 0 ? activeSignData(locations, values[0]) : locations,
            };
        }
        return null;
    }

    componentDidUpdate() {
        let {value, labelText} = this.props;

        /*** 父组件通过 ref 调用 triggerChange 方法修改 labelText ****/
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        // 初次更新数据时，使用 props
        if (this.state.isFirst && labelText) {
            let labels = labelText.split('/');

            this.setState({
                isFirst: false,
                labelText:
                    labels.length === 3 && labels[2] === '全部'
                        ? labels.splice(0, 2).join('/')
                        : labelText,
                values: value || [],
            });
        }
    }

    componentDidMount() {
        let initValue = this.state.values;

        if (initValue && initValue.length > 0) {
            this.setState({
                provinceId: initValue[0] || '', // 选中的省 id
                cityId: initValue[1] || '', // 选中的市 id
                regionId: initValue[2] || '', // 选中的区 id
            });
        }
        // 隐藏下拉框
        this._onBlurHandler(this);
    }

    componentWillUnmount() {
        // 卸载 body 上绑定的指定事件
        document.body.removeEventListener('click', e => this.clickFunction(this, e), false);
        // 手机端 touchend
        document.body.removeEventListener('touchend', e => this.clickFunction(this, e), false);
    }

    // 点击该组件其他区域时，隐藏下拉框
    _onBlurHandler(me) {
        document.body.addEventListener('click', e => me.clickFunction(me, e), false);
        // 手机端 touchend
        document.body.addEventListener('touchend', e => me.clickFunction(me, e), false);
    }

    // 监听 document.body 点击事件
    clickFunction = (me, e) => {
        // 匹配当前组件内的所有元素
        if (
            matchesSelector(e.target, '.forceyu-widgets-location-cascader-index-locationCascader *')
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
        if (!data || (data && data.length < 1)) {
            if (type === 'province') {
                return (
                    <div className={styles.cascaderMenu}>
                        <AntdEmpty />
                    </div>
                );
            }
            return null;
        }

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
                <Icon type="right" />
            </span>
        );
    };

    // 点击显示 下拉框
    handleClick = e => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            menuVisible: !this.state.menuVisible,
        });
    };

    /**
     * @method 获取省对应的市数据
     * @param {*} callback 回调
     */
    getCitysData = (value, callback) => {
        const {dispatch, cityDisp} = this.props;

        // 判断是否使用其他接口获取数据
        let params = {
            type: 'location/getCitys',
            payload: {
                query: {
                    provinceId: value,
                },
            },
        };

        // 判断是否使用其他接口获取数据
        if (cityDisp) {
            params = {
                type: cityDisp.type,
                payload: {
                    provinceId: value,
                    ...cityDisp.payload,
                },
            };
        }
        dispatch({...params, callback});
    };

    /**
     * @method 获取市对应的区数据
     * @param {String} value 选中的市id
     * @param {*} callback 回调
     */
    getRegionsData = (value, callback) => {
        const {dispatch, regionDisp} = this.props;

        let params = {
            type: 'location/getRegions',
            payload: {
                query: {cityId: value},
            },
        };

        // 判断是否使用其他接口获取数据
        if (regionDisp) {
            params = {
                type: regionDisp.type,
                payload: {
                    cityId: value,
                    ...regionDisp.payload,
                },
            };
        }

        dispatch({...params, callback});
    };

    /**
     * @method 省市区 子菜单点击事件
     * @param [String] type 对应省市区 类型
     * @param [Object] item 对应省市区 key/value
     */
    handleMenuItemClick = (type, item, e) => {
        e.preventDefault();
        e.stopPropagation();

        let target = e.currentTarget.parentNode;
        const {
            state: {provinces, citys, regions, provinceName, cityName, provinceId, cityId},
            props: {isChooseCity},
        } = this;

        // 省 -- 获取对应市,并踢出同一个字段
        if (type === 'province') {
            this.getCitysData(item.value, data => {
                this.setState(
                    {
                        provinceName: item.label,
                        provinceId: item.value,
                        regions: [],
                        citys: isChooseCity ? data : addIsLeaf(data),
                        provinces: activeSignData(provinces, item.value),
                    },
                    () => {
                        this.changeSelectOffset(target);
                    }
                );
            });
        }
        // 市 -- 获取对应区
        if (type === 'city') {
            // 只选择到市
            if (isChooseCity) {
                const labelText = `${provinceName}/${item.label}`;
                this.setState({
                    labelText,
                    menuVisible: false,
                    citys: activeSignData(citys, item.value),
                });
                this.triggerChange([provinceId, item.value], labelText);
            } else {
                this.getRegionsData(item.value, data => {
                    this.setState(
                        {
                            cityName: item.label,
                            cityId: item.value,
                            regions: [{value: '123', label: '全部'}, ...data],
                            citys: activeSignData(citys, item.value),
                        },
                        () => {
                            this.changeSelectOffset(target);
                        }
                    );
                });
            }
        }
        // 区 -- 赋值
        if (type === 'region') {
            let labelText = `${provinceName}/${cityName}/${item.label}`;
            // 可以选择全部区：不展示文案
            if (item.label === '全部') {
                labelText = `${provinceName}/${cityName}`;
            }
            this.setState({
                labelText,
                menuVisible: false,
                regionId: item.value,
                regions: activeSignData(regions, item.value),
            });
            this.triggerChange([provinceId, cityId, item.value], labelText);
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
    triggerChange = (values, labelText = '') => {
        // Should provide an event to pass value to Form.
        const {onChange} = this.props;
        if (onChange) {
            onChange(values, labelText);
        }

        this.setState({labelText});
    };

    // 清空数据
    onClear = () => {
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
        this.triggerChange([], '');
    };

    render() {
        const {options, placeholder = '请选择', allowClear} = this.props;
        const {menuVisible, provinces, citys, regions, style, labelText} = this.state;

        return (
            <div className={styles.locationCascader}>
                <span className={styles.locationPicker} title={labelText}>
                    <span className={styles.cascaderLabel}>{labelText}</span>
                    <Input
                        className={styles.cascaderInput}
                        placeholder={labelText ? '' : placeholder}
                        readOnly
                        autoComplete="off"
                        type="text"
                        value=""
                        onClick={this.handleClick}
                        {...options}
                    />

                    {/* 清空选中的地址数据 */}
                    {allowClear && labelText && (
                        <Icon
                            type="close-circle"
                            className={styles.closeCircle}
                            onClick={this.onClear}
                        />
                    )}

                    {/* 上下箭头 */}
                    <Icon
                        type="down"
                        className={classNames(styles.cascaderIcon, {
                            [styles.cascaderIconExpand]: menuVisible,
                        })}
                    />
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
