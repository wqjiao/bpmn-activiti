/**
 * 车辆选择器
 * @use
 <CarSelect
    carType={carType} // 车辆类型，1:乘用车; 2:上用户侧
    dispatch={dispatch}
    inputValue={modelName} // isPropsName与modelName一起使用
    changeCarSelect={this.changeCarSelect} // 修改props.modelName的回调
    onRef={this.onRef} // 可选，父组件通过 ref 调用 setInputValue 方法修改 inputValue
 />
 */
import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import styles from './index.less';

// isPropsName true 表示使用并仅修改 props.modelName
class CarSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: this.props.inputValue,
            brands: [],
            brandOpen: false,
            brandId: '',
            brandName: '',
            series: [],
            seriesOpen: false,
            serieId: '',
            serieName: '',
            models: [],
            modelsOpen: false,
            modelId: this.props.value,
            modelName: '',
            carType: this.props.carType,
        };
    }

    componentDidMount() {
        // 可选，父组件通过 ref 调用 setInputValue 方法修改 inputValue
        const {onRef} = this.props;
        if (onRef) {
            onRef(this);
        }
        this.getBrand();
    }

    // 父组件通过 ref 调用 setInputValue 方法修改 inputValue
    setInputValue = inputValue => {
        const {placeholder = '请选择'} = this.props;
        this.setState({
            inputValue: inputValue || placeholder,
        });
    };

    getBrand() {
        if (this.props.carType) {
            let {dispatch, placeholder = '请选择'} = this.props;
            if (!this.props.inputValue) {
                this.setState({
                    inputValue: placeholder,
                });
            }
            dispatch({
                type: 'carList/getBrandByType',
                payload: {
                    carType: this.props.carType,
                },
                callback: data => {
                    this.setState({
                        brands: data,
                        carType: this.props.carType,
                    });
                },
            });
        }
    }

    componentDidUpdate = () => {
        if (this.state.carType !== this.props.carType) {
            this.getBrand();
        }
    };

    // 打开车型选择
    open = () => {
        const {brandOpen, seriesOpen, modelsOpen} = this.state;
        this.setState({
            brandOpen: brandOpen || seriesOpen || modelsOpen ? false : true,
            seriesOpen: false,
            modelsOpen: false,
        });
    };

    //点击空白处收起菜单
    close = () => {
        this.setState({
            brandOpen: false,
            seriesOpen: false,
            modelsOpen: false,
        });
    };

    /**
     * [选择品牌]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectBrand = e => {
        let brandId = e.currentTarget.getAttribute('data-id');
        let brandName = e.currentTarget.getAttribute('data-name');
        let {dispatch} = this.props;
        this.setState({
            brandId,
            brandName,
        });
        dispatch({
            type: 'carList/getSeriesByBrand',
            payload: {
                carType: this.props.carType,
                carBrand: brandId,
            },
            callback: data => {
                this.setState({
                    series: data,
                    seriesOpen: true,
                    brandOpen: false,
                });
            },
        });
    };

    /**
     * 选择车系
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectSeries = e => {
        let serieId = e.currentTarget.getAttribute('data-id');
        let serieName = e.currentTarget.getAttribute('data-name');
        let {dispatch} = this.props;
        this.setState({
            serieId,
            serieName,
        });
        dispatch({
            type: 'carList/getModelBySeries',
            payload: {
                carType: this.props.carType,
                carSeries: serieId,
            },
            callback: data => {
                this.setState({
                    models: data,
                    modelsOpen: true,
                    seriesOpen: false,
                });
            },
        });
    };

    selectModels = e => {
        let modelId = e.target.getAttribute('data-id');
        let modelName = e.target.getAttribute('data-name');
        let modelPrice = e.target.getAttribute('data-price');
        this.setState({
            modelId,
            inputValue: modelName,
            modelName: modelName,
            brandOpen: false,
            seriesOpen: false,
            modelsOpen: false,
        });
        const {brandName, serieName} = this.state;
        let callbackData = {
            brandName: brandName,
            serieName: serieName,
            modelId: modelId,
            modelName: modelName,
            modelPrice: modelPrice,
        };
        const {onChange, changeCarSelect} = this.props;
        // 修改车型id
        if (onChange) {
            onChange(modelId);
        }
        // 回传需要的其他值
        if (changeCarSelect) {
            changeCarSelect(callbackData);
        }
    };

    //创建左侧导航栏
    leftBar = () => {
        const {brands} = this.state;
        let initial = '';

        return brands.map(v => {
            if (initial !== v.initial) {
                initial = v.initial;
                return (
                    <li key={v.id + 'brand'}>
                        <div
                            onClick={this.scrollLeftBar.bind(this, v.initial)}
                            name={v.initial}
                            className={styles.CarBrandLetter}
                        >
                            {v.initial}
                        </div>
                    </li>
                );
            }
        });
    };

    //锚点事件
    scrollLeftBar = initial => {
        document.getElementById(initial).scrollIntoView();
    };

    /**
     * 创建品牌
     * @return {[type]} [description]
     */
    createBrand = () => {
        const {brands, brandId} = this.state;
        let initial = '';

        return brands.map(v => {
            if (initial !== v.initial) {
                initial = v.initial;
                return (
                    <li key={v.id + 'brand'}>
                        <div id={v.initial} className={styles.CarBrandLetter}>
                            {v.initial}
                        </div>
                        <p
                            id={v.id}
                            className={brandId === v.id ? 'Selected' : ''}
                            data-id={v.id}
                            data-name={v.name}
                            onClick={this.selectBrand}
                        >
                            {v.name}
                        </p>
                    </li>
                );
            }
            return (
                <li key={v.id + 'brand'}>
                    <p
                        id={v.id}
                        className={brandId === v.id ? 'Selected' : ''}
                        data-id={v.id}
                        data-name={v.name}
                        onClick={this.selectBrand}
                    >
                        {v.name}
                    </p>
                </li>
            );
        });
    };

    /**
     * 创建车系
     * @return {[type]} [description]
     */
    createSeries = () => {
        const {series, serieId} = this.state;
        let seriesGroupName = '';

        return series.map(v => {
            if (seriesGroupName !== v.seriesGroupName) {
                seriesGroupName = v.seriesGroupName;
                return (
                    <li key={v.id + 'series'}>
                        <div className={styles.CarBrandLetter}>{v.seriesGroupName}</div>
                        <p
                            className={serieId === v.id ? 'Selected' : ''}
                            data-id={v.id}
                            data-name={v.name}
                            onClick={this.selectSeries}
                        >
                            {v.name}
                        </p>
                    </li>
                );
            }
            return (
                <li key={v.id + 'series'}>
                    <p
                        className={serieId === v.id ? 'Selected' : ''}
                        data-id={v.id}
                        data-name={v.name}
                        onClick={this.selectSeries}
                    >
                        {v.name}
                    </p>
                </li>
            );
        });
    };

    /**
     * 创建车型
     * @return {[type]} [description]
     */
    createModels = () => {
        const {models, modelId} = this.state;
        let year = '';

        return models.map(v => {
            if (year !== (v.carType ? v.carType : v.year)) {
                year = v.carType ? v.carType : v.year;
                return (
                    <li key={v.id + 'models'}>
                        <div className={styles.CarBrandLetter}>
                            {v.carType ? v.carType : v.year}
                        </div>
                        <p
                            className={modelId === v.id ? 'Selected' : ''}
                            data-id={v.id}
                            data-name={v.name}
                            data-price={v.price}
                            onClick={this.selectModels}
                        >
                            {v.name}
                        </p>
                    </li>
                );
            }
            return (
                <li key={v.id + 'model'}>
                    <p
                        className={modelId === v.id ? 'Selected' : ''}
                        data-id={v.id}
                        data-name={v.name}
                        data-price={v.price}
                        onClick={this.selectModels}
                    >
                        {v.name}
                    </p>
                </li>
            );
        });
    };

    arrowBack = index => {
        this.setState({
            brandOpen: index === 1 ? true : false,
            seriesOpen: index === 2 ? true : false,
            modelsOpen: index === 3 ? true : false,
        });
    };

    // 清空选中数据
    handleClearLabel = () => {
        this.setState({
            modelId: '',
            inputValue: this.props.placeholder || '请选择',
            modelName: '',
            brandOpen: false,
            seriesOpen: false,
            modelsOpen: false,
            brandName: '',
            serieName: '',
        });
        let callbackData = {
            brandName: '',
            serieName: '',
            modelId: '',
            modelName: '',
            modelPrice: '',
        };
        const {onChange, changeCarSelect} = this.props;
        // 修改车型id
        if (onChange) {
            onChange('');
        }
        // 回传需要的其他值
        if (changeCarSelect) {
            changeCarSelect(callbackData);
        }
    };

    render() {
        const {
            inputValue,
            brandOpen,
            seriesOpen,
            modelsOpen,
            brandId,
            serieId,
            modelId,
        } = this.state;
        const {carInfo, placeholder = '请选择'} = this.props;
        let style = inputValue === placeholder ? {color: '#bbb'} : {};

        return (
            <div
                className={
                    brandOpen
                        ? 'Car-selectContainer ant-select-open ' + styles.CarSelectContainer
                        : 'Car-selectContainer ' + styles.CarSelectContainer
                }
            >
                <div
                    className={brandOpen || seriesOpen || modelsOpen ? styles.closeMask : ''}
                    onClick={() => this.close()}
                />
                <div className={styles.antSelectSelection + ' ant-select-selection'}>
                    <div className="ant-select-selection__rendered" onClick={() => this.open()}>
                        <div
                            className="ant-select-selection-selected-value"
                            title={inputValue ? inputValue : carInfo}
                            style={style}
                        >
                            {inputValue ? inputValue : carInfo}
                        </div>
                    </div>
                    <span className="ant-select-arr ow">
                        <b />
                    </span>
                    {/* 清空选中数据 */}
                    {modelId && (
                        <Icon
                            type="close-circle"
                            className={styles.closeCircle}
                            onClick={this.handleClearLabel}
                        />
                    )}
                </div>
                <div className={styles.CarSelectUl}>
                    {brandOpen ? (
                        <div className={styles.CarBrand}>
                            <span className={styles.CarBrandTitle}>
                                <span>选择品牌</span>
                            </span>
                            <ul className={styles.leftBar}>{this.leftBar()}</ul>
                            <ul>{this.createBrand()}</ul>
                        </div>
                    ) : (
                        ''
                    )}
                    {seriesOpen ? (
                        <div className={styles.CarSeries}>
                            <span className={styles.CarSeriesTitle}>
                                {brandId ? (
                                    <span
                                        className={styles.backLeftArrow}
                                        onClick={() => this.arrowBack(1)}
                                    >
                                        ＜
                                    </span>
                                ) : (
                                    ''
                                )}
                                <span>选择车系</span>
                            </span>
                            <ul>{this.createSeries()}</ul>
                        </div>
                    ) : (
                        ''
                    )}
                    {modelsOpen ? (
                        <div className={styles.CarModels}>
                            <span className={styles.CarModelsTitle}>
                                {serieId ? (
                                    <span
                                        className={styles.backLeftArrow}
                                        onClick={() => this.arrowBack(2)}
                                    >
                                        ＜
                                    </span>
                                ) : (
                                    ''
                                )}
                                <span>选择车型</span>
                            </span>
                            <ul>{this.createModels()}</ul>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}

export default CarSelect;
