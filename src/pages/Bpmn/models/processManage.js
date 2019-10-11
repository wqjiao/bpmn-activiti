/*
 * @Author: wqjiao
 * @Date: 2019-04-04 09:53:49
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-10-11 14:49:32
 * @Description: customer 客户信息
 */
import {
    getFlowList,
    updateFlow,
    copyFlow,
    deleteFlow,
    findBPMNById,
    updateBPMN,
    initFlowSelect,
    getPageUseDict,
    getProcessData,
} from '@/services/bpmnApi';

export default {
    namespace: 'processManage',

    state: {
        data: [], // 列表数据
    },

    effects: {
        // 获取流程信息列表
        *getFlowList({payload, callback}, {call, put}) {
            const response = yield call(getFlowList, payload);
            if (!response) return;
            yield put({
                type: 'save',
                payload: response.data,
                key: 'data',
            });
            if (callback) callback(response.data);
        },
        // 更新/新增流程
        *updateFlow({payload, callback}, {call}) {
            const response = yield call(updateFlow, payload);
            if (!response) return;
            if (callback) callback(response);
        },
        // 复制流程
        *copyFlow({payload, callback}, {call}) {
            const response = yield call(copyFlow, payload);
            if (!response) return;
            if (callback) callback(response);
        },
        // 删除流程
        *deleteFlow({payload, callback}, {call}) {
            const response = yield call(deleteFlow, payload);
            if (!response) return;
            if (callback) callback(response);
        },
        // 查询流程设计
        *findBPMNById({payload, callback}, {call}) {
            const response = yield call(findBPMNById, payload);
            if (!response) return;
            if (callback) callback(response.data);
        },
        // 保存流程设计
        *updateBPMN({payload, callback}, {call}) {
            const response = yield call(updateBPMN, payload);
            if (!response) return;
            if (callback) callback(response);
        },
        // 初始化流程下拉框
        *initFlowSelect({payload, callback}, {call}) {
            const response = yield call(initFlowSelect, payload);
            if (!response) return;
            if (callback) callback(response.data);
        },
        // 获取数据字典
        *getPageUseDict({payload, callback}, {call}) {
            const response = yield call(getPageUseDict, payload);
            if (!response) return;
            if (callback) callback(response.data);
        },
        // 获取数据字典
        *getProcessData({payload, callback}, {call}) {
            const response = yield call(getProcessData, payload);
            if (!response) return;
            if (callback) callback(response.data);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                [action.key]: action.payload,
            };
        },
        // 清空 model--state 数据
        clear() {
            return {
                data: [],
            };
        },
    },
};
