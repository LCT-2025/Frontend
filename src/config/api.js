// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Public endpoints
  IMAGES: `${API_BASE_URL}/api/images`,
  MODELS: `${API_BASE_URL}/api/models`,
  RESOURCES_BY_NAME: (name) => `${API_BASE_URL}/api/resources/name/${name}`,
  RESOURCES_BY_ID: (id) => `${API_BASE_URL}/api/resources/${id}`,
  IMAGE_BY_NAME: (name) => `${API_BASE_URL}/api/image/${name}`,
  MODEL_BY_NAME: (name) => `${API_BASE_URL}/api/model/${name}`,
  
  // File serving
  IMAGE_FILE: (name) => `${API_BASE_URL}/files/image/${name}`,
  MODEL_FILE: (name) => `${API_BASE_URL}/files/model/${name}`,
  
  // Metrics
  VISIT_METRICS: `${API_BASE_URL}/api/metrics/visit`,
  SESSION_METRICS: `${API_BASE_URL}/api/metrics/session`,
  
  // Compilation endpoints
  COMPILATION_IMAGES: `${API_BASE_URL}/api/compilation/images`,
  COMPILATION_SAVE: `${API_BASE_URL}/api/compilation/save`,
  COMPILATION_MAPPINGS: `${API_BASE_URL}/api/compilation/mappings`,
  COMPILATION_IMAGES_WITH_MAPPINGS: `${API_BASE_URL}/api/compilation/images-with-mappings`,
  COMPILATION_MIND_FILE: `${API_BASE_URL}/api/compilation/mind-file`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_PROFILE: `${API_BASE_URL}/admin/profile`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADMIN_IMAGES: `${API_BASE_URL}/admin/images`,
  ADMIN_MODELS: `${API_BASE_URL}/admin/models`,
  ADMIN_STATS: `${API_BASE_URL}/admin/stats`,
  ADMIN_STATS_VISITS: `${API_BASE_URL}/admin/stats/visits`,
  ADMIN_STATS_DOWNLOADS: `${API_BASE_URL}/admin/stats/downloads`,
};

export default API_BASE_URL;
