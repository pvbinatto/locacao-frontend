const BASE_URL = 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const getStoredToken = () => localStorage.getItem('locacar_token');

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('locacar_token');
      window.location.href = '/login';
      return;
    }
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  login: (data: any) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

export const vehicleApi = {
  list: () => api('/vehicles'),
  create: (data: any) => api('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getByPlate: (plate: string) => api(`/vehicles/plate/${plate}`),
  getMaintenanceCount: () => api('/vehicles/maintenance/count'),
};

export const dashboardApi = {
  getStats: () => api('/dashboard/stats'),
};

export const customerApi = {
  list: () => api('/customers'),
  create: (data: any) => api('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const rentalApi = {
  list: () => api('/rentals'),
  create: (data: any) => api('/rentals', { method: 'POST', body: JSON.stringify(data) }),
  returnByPlate: (plate: string) => api(`/rentals/return/${plate}`, { method: 'POST' }),
};

export const maintenanceApi = {
  list: () => api('/maintenances'),
  get: (id: string) => api(`/maintenances/${id}`),
  create: (data: any) => api('/maintenances', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/maintenances/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/maintenances/${id}`, { method: 'DELETE' }),
};
