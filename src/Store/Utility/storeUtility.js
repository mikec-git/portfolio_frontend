// Creates a reducer with simpler syntax to understand
export const createReducer = (initialState, handlers) => 
(state = initialState, action) => {
  if(handlers.hasOwnProperty(action.type)) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
}
