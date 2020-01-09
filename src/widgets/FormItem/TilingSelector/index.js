/*
 * @Author: wqjiao 
 * @Date: 2019-08-21 16:35:50 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2020-01-08 19:05:23
 * @Description: 面板式城市选择器组件
 * @use: 组件使用说明
    <TilingSelector
        value={[]} // form 对应 initialValue
        label={[]}
        dispatch={dispatch}
        provinces={[]}
    /> 
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tabs, Popover, Icon, Input} from 'antd';
import AntdEmpty from '../AntdEmpty';
import NewPortal from './NewPortal';
import {activeSignData, matchesSelector} from '@/utils/funcUtils';
import styles from './index.less';

const {TabPane} = Tabs;

class TilingSelector extends Component {
    static propTypes = {
        value: PropTypes.array, // codes 数组
        label: PropTypes.array, // 中文数组
        provinces: PropTypes.array, // 省数组
        chooseTier: PropTypes.number, // 默认选至区: 1->省 2->市 3->区
        cityDisp: PropTypes.object, // 市接口，默认公共接口 {{ type: '', payload: {} }}
        regionDisp: PropTypes.object, // 区接口，默认公共接口 {{ type: '', payload: {} }}
        dispatch: PropTypes.func,
        onChange: PropTypes.func,
        allowClear: PropTypes.bool, // 是否可清空，默认支持清空
    };

    static defaultProps = {
        label: [],
        chooseTier: 3,
        allowClear: true,
    };

    state = {
        panes: [{title: '请选择省', key: 'province'}], // 省市区切换 tabPanes
        tabKey: 'province', // 选中的省市 tab
        menuVisible: false, // 下拉框显示与否
        values: [], // 初始化数据
        labelText: '', // 文本内容
        provinces: [], // 省数据
        citys: [], // 市数据
        regions: [], // 区数据
        provinceItem: {}, // 选中的省
        cityItem: {}, // 选中的市
        isFirst: true, // 初次进入页面
        style: {}, // 下拉选项自定义样式
    };

    componentDidUpdate() {
        const {value, label} = this.props;
        const {isFirst} = this.state;

        // 初次更新数据时，使用 props
        if (isFirst && label.length > 0) {
            let labelText = label.join('/');

            if (label.length === 3 && label[2] === '全部') {
                labelText = label.splice(0, 2).join('/');
            }

            this.setState({
                isFirst: false,
                values: value,
                labelText,
                panes: [{title: label[0], key: 'province'}],
            });
        }
    }

    componentDidMount() {
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
            matchesSelector(
                e.target,
                `.forceyu-widgets-tiling-selector-index-locationTile *,
                .forceyu-widgets-tiling-selector-index-tileMenus *`
            )
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
    renderTileMenu = tabKey => {
        let data = this.state[`${tabKey}s`];

        // 无数据显示 -- 暂无数据
        if (!data || (data && data.length < 1)) {
            return (
                <div className={styles.tileMenu}>
                    <AntdEmpty />
                </div>
            );
        }

        return (
            <ul className={styles.tileMenu}>
                {data.map(item => {
                    const content = (
                        <li
                            className={classNames(styles.tileMenuItem, {
                                [styles.tileMenuItemActive]: item.active,
                            })}
                            onClick={e => this.handleMenuItemClick(e, tabKey, item)}
                            key={`${item.label}-${item.value}`}
                        >
                            {item.label}
                        </li>
                    );

                    if (item.label.length < 8) return content;

                    // 内容超过7位时，title 提示
                    return (
                        <Popover content={item.label} key={`${item.label}-${item.value}`}>
                            {content}
                        </Popover>
                    );
                })}
            </ul>
        );
    };

    /**
     * @method 获取省对应的市数据
     * @param {*} callback 回调
     */
    getCitysData = (value, callback) => {
        const {dispatch, cityDisp, chooseTier} = this.props;

        // 只展示省级
        if (chooseTier === 1) return;

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
        const {dispatch, regionDisp, chooseTier} = this.props;

        // 只展示省市级
        if (chooseTier === 2) return;

        let params = {
            type: 'location/getRegions',
            payload: {
                query: {
                    cityId: value,
                },
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

    // 点击显示 下拉框
    handleClick = e => {
        e.preventDefault();

        const {
            state: {menuVisible},
            props: {value = [], provinces},
        } = this;

        // 地区选择器初始位置定位
        const offset = e.currentTarget.getBoundingClientRect();
        const scrollElm = document.documentElement;
        const scrollBody = document.body;

        const scrollTop = scrollElm.scrollTop || scrollBody.scrollTop,
            scrollLeft = scrollElm.scrollLeft || scrollBody.scrollLeft,
            scrollHeight = scrollElm.scrollHeight || scrollBody.scrollHeight,
            scrollWidth = scrollElm.scrollWidth || scrollBody.scrollWidth;

        const bottom = scrollHeight - scrollTop - offset.bottom;
        const top = scrollTop + offset.top;
        const right = scrollWidth - scrollLeft - offset.left;

        // Menus left
        let left = scrollLeft + offset.left;
        if (right < 360) {
            left = scrollWidth < 360 ? 0 : offset.right - 360;
        }

        this.setState({
            menuVisible: !menuVisible,
            provinces: value.length > 0 ? activeSignData(provinces, value[0]) : provinces,
            style: {
                left,
                top: bottom > 256 ? top + offset.height : top - 256,
            },
        });
    };

    /**
     * @method 省市区 子菜单点击事件
     * @param [String] tabKey 对应省市区 类型
     * @param [Object] item 对应省市区 key/value
     */
    handleMenuItemClick = (e, tabKey, item) => {
        e.preventDefault();
        e.stopPropagation();

        const {chooseTier} = this.props;
        let {provinces, citys, regions, panes, provinceItem, cityItem} = this.state;

        // 根据指定id -- 获取对应市/区
        if (tabKey === 'province') {
            panes[0].title = item.label;

            // 只到省
            if (chooseTier === 1) {
                this.setState({
                    panes,
                    provinceItem: item,
                    labelText: item.label,
                    provinces: activeSignData(provinces, item.value),
                    menuVisible: false,
                });
            } else {
                panes[1] = {title: '请选择市', key: 'city'};
                // 避免点击同一个省获取市数据
                if (item.value === provinceItem.value) {
                    this.setState({
                        panes,
                        tabKey: 'city',
                    });
                } else {
                    this.getCitysData(item.value, data => {
                        this.setState({
                            panes,
                            tabKey: 'city',
                            provinceItem: item,
                            provinces: activeSignData(provinces, item.value),
                            citys: data,
                        });
                    });
                }
            }
        } else if (tabKey === 'city') {
            panes[1].title = item.label;

            // 只选择到市
            if (chooseTier === 2) {
                const labelText = `${provinceItem.label}/${item.label}`;
                this.setState({
                    panes,
                    cityItem: item,
                    labelText,
                    citys: activeSignData(citys, item.value),
                    menuVisible: false,
                });
                this.triggerChange([provinceItem.value, item.value], labelText.split('/'));
            } else {
                panes[2] = {title: '请选择区', key: 'region'};

                // 避免点击同一个市获取区数据
                if (item.value === cityItem.value) {
                    this.setState({
                        panes,
                        tabKey: 'region',
                    });
                } else {
                    this.getRegionsData(item.value, data => {
                        this.setState({
                            panes,
                            tabKey: 'region',
                            cityItem: item,
                            citys: activeSignData(citys, item.value),
                            regions: data,
                        });
                    });
                }
            }
        } else if (tabKey === 'region') {
            panes[2].title = item.label;
            let labelText = `${provinceItem.label}/${cityItem.label}/${item.label}`;

            // 可以选择全部区：不展示文案
            if (item.label === '全部') {
                labelText = `${provinceItem.label}/${cityItem.label}`;
            }

            this.setState({
                panes,
                labelText,
                regions: activeSignData(regions, item.value),
                menuVisible: false,
            });
            this.triggerChange(
                [provinceItem.value, cityItem.value, item.value],
                labelText.split('/')
            );
        }
    };

    // 切换Tabs
    handleTabsChange = activeKey => {
        let panes = this.state.panes.filter(item => {
            if (activeKey == 'province') {
                return item.key === 'province';
            } else if (activeKey == 'city') {
                return item.key !== 'region';
            }

            return item.key !== '';
        });

        this.setState({
            tabKey: activeKey,
            panes,
        });
    };

    // 更新 Form 表单对应 value
    triggerChange = (values, labels) => {
        // Should provide an event to pass value to Form.
        const {onChange} = this.props;

        if (onChange) {
            onChange(values, labels);
        }
    };

    // 清空数据
    handleClearLabel = () => {
        this.setState({
            panes: [{title: '请选择省', key: 'province'}],
            tabKey: 'province',
            labelText: '',
            menuVisible: false,
        });
        // 是否需要中文字段
        this.triggerChange([], []);
    };

    render() {
        const {menuVisible, panes, tabKey, labelText, style} = this.state;
        const {placeholder, allowClear} = this.props;

        return (
            <div className={styles.locationTile}>
                <span className={styles.locationPicker}>
                    <Input
                        readOnly
                        value={labelText}
                        onClick={this.handleClick}
                        placeholder={placeholder || '请选择'}
                    />

                    {/* 上下箭头 */}
                    <Icon
                        type="down"
                        className={classNames(styles.tileIcon, {
                            [styles.tileIconExpand]: menuVisible,
                        })}
                    />

                    {/* 清空选中的地址数据 */}
                    {allowClear && labelText && (
                        <Icon
                            type="close-circle"
                            className={styles.closeCircle}
                            onClick={this.handleClearLabel}
                        />
                    )}
                </span>
                <NewPortal>
                    <div
                        className={classNames(styles.tileMenus, {
                            [styles.menusHidden]: !menuVisible,
                        })}
                        style={style}
                    >
                        <Tabs activeKey={tabKey} onChange={this.handleTabsChange}>
                            {panes.map(pane => (
                                <TabPane tab={pane.title} key={pane.key}>
                                    {this.renderTileMenu(tabKey)}
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
                </NewPortal>
            </div>
        );
    }
}

export default TilingSelector;
