const emptyResponse = {
  data: [],
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

const resolveEmpty = async () => emptyResponse;

const api = Object.assign(resolveEmpty, {
  get: resolveEmpty,
  post: resolveEmpty,
  put: resolveEmpty,
  patch: resolveEmpty,
  delete: resolveEmpty,
  interceptors: {
    request: { use: () => 0, eject: () => {} },
    response: { use: () => 0, eject: () => {} },
  },
});

export default api;
