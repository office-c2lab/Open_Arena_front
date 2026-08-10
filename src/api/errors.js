const getDetailMessage = detail => {
  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map(item => item?.msg)
      .filter(Boolean)
      .join(', ');
  }

  if (detail && typeof detail === 'object' && typeof detail.message === 'string') {
    return detail.message;
  }

  return null;
};

export class ApiError extends Error {
  constructor(message, { status = null, code = null, details = null, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static from(error) {
    if (error instanceof ApiError) return error;

    const response = error?.response;
    const data = response?.data;
    const message =
      getDetailMessage(data?.detail) ||
      data?.message ||
      (error?.code === 'ECONNABORTED'
        ? '요청 시간이 초과되었습니다.'
        : 'API 요청 중 오류가 발생했습니다.');

    return new ApiError(message, {
      status: response?.status ?? null,
      code: data?.code ?? data?.detail?.code ?? error?.code ?? null,
      details: data ?? null,
      cause: error,
    });
  }
}
