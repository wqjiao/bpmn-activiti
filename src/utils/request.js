import fetch from 'dva/fetch';
import {notification} from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import {isAntdPro} from './utils';
import {stringify} from 'qs';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const authorityFailCodes = [1001, 1002, 4001, 4002];
const key401 = '401'; // 保证401的提示只出现一次，不会频繁出现。

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;

    if (response.status === 401) {
        notification.info({
            key: key401,
            message: errortext,
        });
    } else {
        notification.error({
            message: `请求错误 ${response.status}: ${response.url}`,
            description: errortext,
        });
    }

    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
};

// const cachedSave = (response, hashcode) => {
//     /**
//      * Clone a response data and store it in sessionStorage
//      * Does not support data other than json, Cache only json
//      */
//     const contentType = response.headers.get('Content-Type');
//     if (contentType && contentType.match(/application\/json/i)) {
//         // All data is saved as text
//         response
//             .clone()
//             .text()
//             .then(content => {
//                 sessionStorage.setItem(hashcode, content);
//                 sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//             });
//     }
//     return response;
// };

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
    const token = window.localStorage ? window.localStorage.getItem('token') : '';
    // 环境变量控制接口地址
    url = process.env.apiUrl + url;

    const options = {
        expirys: isAntdPro(),
        ...option,
        headers: {
            // 增加权限校验token字段
            Authorization: token || '',
        },
    };
    /**
     * Produce fingerprints based on url and parameters
     * Maybe url has the same parameters
     */
    const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
    const hashcode = hash
        .sha256()
        .update(fingerprint)
        .digest('hex');

    const defaultOptions = {
        credentials: 'include',
    };

    const newOptions = {...defaultOptions, ...options};

    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                // 'Content-Type': 'application/json; charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                ...newOptions.headers,
            };
            // newOptions.body = JSON.stringify(newOptions.body);
            newOptions.body = stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }

    const expirys = options.expirys && 60;
    // options.expirys !== false, return the cache,
    if (options.expirys !== false) {
        const cached = sessionStorage.getItem(hashcode);
        const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
        if (cached !== null && whenCached !== null) {
            const age = (Date.now() - whenCached) / 1000;
            if (age < expirys) {
                const response = new Response(new Blob([cached]));
                return response.json();
            }
            sessionStorage.removeItem(hashcode);
            sessionStorage.removeItem(`${hashcode}:timestamp`);
        }
    }
    return (
        fetch(url, newOptions)
            .then(checkStatus)
            // .then(response => cachedSave(response, hashcode))
            .then(response => {
                // DELETE and 204 do not return data by default
                // using .json will report an error.
                if (newOptions.method === 'DELETE' || response.status === 204) {
                    return response.text();
                }
                return response.json();
            })
            .then(res => {
                // 对返回数据code进行判断，进行错误提示以及
                if (res.code === 200) {
                    return res;
                } else if (authorityFailCodes.indexOf(res.code) >= 0) {
                    notification.error({
                        message: res.msg,
                    });
                    // 鉴定权限失败
                    window.g_app._store.dispatch({
                        type: 'login/logout',
                    });
                    return;
                } else if (res.code === 4007) {
                    notification.error({
                        key: res.code + '',
                        message: res.msg,
                    });
                    // 当前用户在别处登录，需退出至登录页
                    window.g_app._store.dispatch({
                        type: 'login/logout',
                    });
                    return;
                } else if (res.code === 5002) {
                    // 车架号校验：vin码不合法
                    return;
                } else if (res.code === 5003) {
                    // 警告，可向下执行 -- 担保人身份证重复
                    notification.info({
                        message: res.msg,
                    });
                    return res;
                } else if (res.code >= 4000 && res.code < 5000) {
                    // 接口返回错误
                    notification.error({
                        message: res.msg,
                    });
                    return;
                } else {
                    // 接口返回警告
                    notification.info({
                        message: res.msg,
                    });
                    return;
                }
            })
            .catch(e => {
                const status = e.name;
                if (status === 401) {
                    // 目前产品要求用户接口无权限跳转到主页面，但是可能会出现，
                    // getUserInfo和getMenuInfo有无权限的情况，会出现循环跳转的情况。
                    if (
                        url.indexOf('/api/user/getMenuInfo') > -1 ||
                        url.indexOf('/api/user/getUserInfo') > -1
                    ) {
                        // @HACK
                        /* eslint-disable no-underscore-dangle */
                        window.g_app._store.dispatch({
                            type: 'login/logout',
                        });
                    } else {
                        router.push('/bpmn/processManage');
                    }
                    return;
                }
                // environment should not be used
                if (status === 403) {
                    router.push('/exception/403');
                    return;
                }
                if (status <= 504 && status >= 500) {
                    router.push('/exception/500');
                    return;
                }
                if (status >= 404 && status < 422) {
                    router.push('/exception/404');
                }
            })
    );
}
