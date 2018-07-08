/* eslint-disable */
const REQUESTING = '@@DVA_PLUGIN_COMMON_REQUEST/REQUESTING';
const REQUEST_SUCCESS = '@@DVA_PLUGIN_COMMON_REQUEST/REQUEST_SUCCESS';
const REQUEST_FAIL = '@@DVA_PLUGIN_COMMON_REQUEST/REQUEST_FAIL';
const NAMESPACE = 'commonRequestWrapper';
const COMMON_REQUEST_MODEL_NAMESPACE = '@@DVA_COMMON_REQUEST';
const TYPE = 'DVA_COMMON_REQUEST';
const DISPATCH_TYPE = COMMON_REQUEST_MODEL_NAMESPACE + '/' + TYPE;

function createCerprocessor(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;
  let currentNamespace = namespace;
  const {
    only = [], except = []
  } = opts;
  if (only.length > 0 && except.length > 0) {
    throw Error('It is ambiguous to configurate `only` and `except` items at the same time.');
  }

  function onEffect(effect, {
    put,
    call
  }, model, actionType) {
    const {
      namespace
    } = model;
    if (
      (only.length === 0 && except.length === 0) ||
      (only.length > 0 && only.indexOf(actionType) !== -1) ||
      (except.length > 0 && except.indexOf(actionType) === -1)
    ) {
      return function*(...args) {
        const {
          payload,
          callFunction,
          config,
          namespace: effectNamespace
        } = args[0];
        currentNamespace = effectNamespace || namespace;
        if (callFunction) {
          if (typeof callFunction === 'function') {
            yield put({
              type: REQUESTING,
              payload: {
                namespace: currentNamespace,
                key: config.key
              }
            });
            const data = yield call(callFunction, payload);
            if (data && data.code === 200) {
              yield put({
                type: REQUEST_SUCCESS,
                payload: {
                  namespace: currentNamespace,
                  key: config.key,
                  result: data
                }
              });
              if (typeof config.successCallback === 'function') {
                config.successCallback(data);
              }
            } else {
              yield put({
                type: REQUEST_FAIL,
                payload: {
                  namespace: currentNamespace,
                  key: config.key,
                  error: data
                }
              });
              if (typeof config.failCallback(data) === 'function') {
                config.failCallback(data);
              }
            }
          } else {
            throw Error('callFunction must be a Function type.');
          }
        }
        yield effect(...args);
      }
    } else {
      return effect;
    }
  }

  function onReducer(reducer) {
    return (state, action, ...slices) => {
      const start = reducer(state, action, ...slices);
      switch (action.type) {
        case REQUESTING:
          return {
            ...start,
            [action.payload.namespace]: {
              ...start[action.payload.namespace],
              [action.payload.key]: {
                loading: true
              }
            }
          };
        case REQUEST_SUCCESS:
          return {
            ...start,
            [action.payload.namespace]: {
              ...start[action.payload.namespace],
              [action.payload.key]: {
                loading: false,
                loaded: true,
                result: action.payload.result
              }
            }
          };
        case REQUEST_FAIL:
          return {
            ...start,
            [action.payload.namespace]: {
              ...start[action.payload.namespace],
              [action.payload.key]: {
                loading: false,
                loaded: false,
                error: action.payload.error
              }
            }
          };
        default:
          return start
      }
    }
  }

  return {
    onEffect,
    onReducer
  }
}

const cerprocessorModel = {
  namespace: COMMON_REQUEST_MODEL_NAMESPACE,
  state: {},
  effects: {
    * [TYPE]() {
    }
  },
  reducers: {
  }
};


export {
  createCerprocessor,
  cerprocessorModel,
  DISPATCH_TYPE
}
