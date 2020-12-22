export const getPartialUpdate = (setState, prop) => ({ target }) =>
  setState((s) => ({ ...s, [prop ?? target.name]: target.value }));
