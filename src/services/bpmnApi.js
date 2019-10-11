import request from '@/utils/request';

// 获取字典信息
export async function getPageUseDict(params) {
    return request(`/api/user/dict`, {
        method: 'POST',
        body: params,
    });
}

// 流程信息列表
export async function getFlowList(params) {
    return request(`/api/activiti/list`, {
        method: 'POST',
        body: params,
    });
}
// 新增编辑流程
export async function updateFlow(params) {
    return request(`/api/activiti/save`, {
        method: 'POST',
        body: params,
    });
}
// 复制流程
export async function copyFlow(params) {
    return request(`/api/activiti/copy`, {
        method: 'POST',
        body: params,
    });
}
// 删除流程
export async function deleteFlow(params) {
    return request(`/api/activiti/delete`, {
        method: 'POST',
        body: params,
    });
}
// 查询某个现有的流程设计模板
export async function findBPMNById(params) {
    return request(`/api/activiti/find/bpmn`, {
        method: 'POST',
        body: params,
    });
}
// 新增编辑流程设计模板
export async function updateBPMN(params) {
    return request(`/api/activiti/save/bpmn`, {
        method: 'POST',
        body: params,
    });
}
// 初始化流程下拉框
export async function initFlowSelect(params) {
    return request(`/api/activiti/init`, {
        method: 'POST',
        body: params,
    });
}
// 流程跟踪数据
export async function getProcessData(params) {
    return request(`/api/order/history`, {
        method: 'POST',
        body: params,
    });
}
