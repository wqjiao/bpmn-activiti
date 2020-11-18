import {query as queryUsers, queryCurrent} from '@/services/user';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {
            // 给一个默认的logo
            avatar: 'https://s3.ax1x.com/2020/11/18/DmrGGt.jpg',
        },
    },

    effects: {
        *fetch(_, {call, put}) {
            const response = yield call(queryUsers);
            if (!response) {
                return;
            }
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *fetchCurrent({callback}, {call, put}) {
            const response = yield call(queryCurrent);
            if (!response) {
                return;
            }
            yield put({
                type: 'saveCurrentUser',
                payload: response,
            });
            if (callback) callback(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, {payload}) {
            let newState = {...state};
            newState.currentUser = {
                ...newState.currentUser,
                ...payload.data,
            };
            return newState;
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount,
                },
            };
        },
    },
};
