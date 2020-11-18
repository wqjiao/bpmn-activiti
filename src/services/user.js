import request from '@/utils/request';

export async function query() {
    return request('/api/users');
}

export async function queryCurrent() {
    return request('/api/user/getUserInfo?needUser=true', {
        method: 'POST',
    });
}
