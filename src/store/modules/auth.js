const state = {
    auth: {},
    status: false
}

const mutations = {
    setAuth: (state, data) => {state.auth = data},
    setStatus: (state, data) => {state.status = data}
}

const getters = {
    auth: state => state.auth,
    status: state => state.status
}

const actions = {
    updateAuth: ({commit}, data) => {
        commit('setAuth', data)
    },
    updateStatus: ({commit}, data) => {
        commit('setStatus', data)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}