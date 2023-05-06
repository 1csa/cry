import {Effect} from 'dva';
import {Reducer} from 'redux';
import {
    getSourceList,
    createSource,
    updateSource,
    deleteSource,
    getChainList,
    getChainListGroup,
    createChain,
    updateChain,
    deleteChain
} from '@/services/pqtask';

interface ChainModel {
    namespace: string
    state: any,
    effects: {
        getSourceList: Effect
        createSource: Effect
        updateSource: Effect
        deleteSource: Effect
        getChainList: Effect
        getChainListGroup: Effect
        createChain: Effect
        updateChain: Effect
        deleteChain: Effect
    }
    reducers: {}
}

const Chain: ChainModel = {
    namespace: 'Chain',
    state: {},
    effects: {
        *getSourceList({payload}, {call}) {
            return yield call(getSourceList, payload);
        },
        *createSource({payload}, {call}) {
            return yield call(createSource, payload);
        },
        *updateSource({payload}, {call}) {
            return yield call(updateSource, payload);
        },
        *deleteSource({payload}, {call}) {
            return yield call(deleteSource, payload);
        },
        *getChainList({payload}, {call}) {
            return yield call(getChainList, payload);
        },
        *getChainListGroup ({payload}, {call}) {
            let response = yield call(getChainListGroup, payload);
            return response;
        },
        *createChain({payload}, {call}) {
            return yield call(createChain, payload);
        },
        *updateChain({payload}, {call}) {
            return yield call(updateChain, payload);
        },
        *deleteChain({payload}, {call}) {
            return yield call(deleteChain, payload);
        }
    },
    reducers: {}
}
export default Chain;