export default {
  UPDATE_TOKEN(state, payload) {
    localStorage.setItem('token', JSON.stringify(payload))
    state.token = payload
  },
  DELETE_TOKEN(state) {
    localStorage.removeItem('token')
    state.token = ''
  },
}
