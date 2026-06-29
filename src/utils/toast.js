const listeners = new Set();

export const toast = {
  success: (msg) => emit('success', msg),
  error:   (msg) => emit('error',   msg),
  info:    (msg) => emit('info',    msg),
};

function emit(type, message) {
  listeners.forEach(fn => fn({ type, message, id: Date.now() + Math.random() }));
}

export function subscribe(fn)   { listeners.add(fn);    return () => listeners.delete(fn); }
