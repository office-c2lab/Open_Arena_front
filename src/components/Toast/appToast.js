import toast from 'react-hot-toast';
import { createElement } from 'react';

import ArenaToast from './ArenaToast';

const showToast = (variant, message, options = {}) =>
  toast.custom(toastItem => createElement(ArenaToast, { toastItem, variant, message }), {
    duration: variant === 'error' ? 5000 : 3500,
    ...options,
  });

export const appToast = {
  success: (message, options) => showToast('success', message, options),
  error: (message, options) => showToast('error', message, options),
  info: (message, options) => showToast('info', message, options),
  dismiss: toastId => toast.dismiss(toastId),
};
