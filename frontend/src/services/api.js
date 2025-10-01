const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

export const adminAPI = {
  addAdmin: async (adminData) => {
    const response = await fetch(`${API_BASE_URL}/auth/add-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/vehicles?${queryParams}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },


  update: async (id, vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getHistory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/history/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Trips API
export const tripsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/trips${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (tripData) => {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },

  update: async (id, tripData) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },

  endTrip: async (id, endData) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}/end`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(endData),
    });
    return handleResponse(response);
  },
};

// Maintenance API
export const maintenanceAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/maintenance${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  getMaintenanceDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/maintenance/stats/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (maintenanceData) => {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(maintenanceData),
    });
    return handleResponse(response);
  },

  update: async (id, maintenanceData) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(maintenanceData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Departments API
export const departmentsAPI = {
  getAll: async () => {
    const url = `${API_BASE_URL}/departments`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (departmentData) => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });
    return handleResponse(response);
  },

  update: async (id, departmentData) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getVehicleAnalytics: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/vehicles?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTripAnalytics: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/trips?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getFuelAnalytics: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/fuel?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMaintenanceAnalytics: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/maintenance?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getDepartmentAnalytics: async (filter = 'all', dateRange = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/departments?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUtilizationAnalytics: async (filter = 'all', dateRange = null, departmentId = null, userId = null, companyId = null) => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }
    if (departmentId) params.append('department_id', departmentId);
    if (userId) params.append('user_id', userId);
    if (companyId) params.append('company_id', companyId);
    
    const response = await fetch(`${API_BASE_URL}/analytics/utilization?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Users API
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Utility functions
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}; 