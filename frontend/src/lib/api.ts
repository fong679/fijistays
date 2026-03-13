import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('fijistays-auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    } catch {}
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const raw = localStorage.getItem('fijistays-auth');
        if (raw) {
          const { state } = JSON.parse(raw);
          if (state?.refreshToken && state?.user?.id) {
            const { data } = await axios.post('/api/v1/auth/refresh', {
              userId: state.user.id,
              refreshToken: state.refreshToken,
            });
            // Update stored tokens
            const updated = JSON.parse(raw);
            updated.state.accessToken = data.accessToken;
            updated.state.refreshToken = data.refreshToken;
            localStorage.setItem('fijistays-auth', JSON.stringify(updated));
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
          }
        }
      } catch {
        // Refresh failed — clear auth
        localStorage.removeItem('fijistays-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
