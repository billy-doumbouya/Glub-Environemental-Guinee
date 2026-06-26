// src/api/services.js
// Services API — une fonction par action, utilise l'instance Axios centralisée

import api from "./axios";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: (password) => api.post("/api/auth/login", { password }),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get("/api/auth/me"),
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projectsService = {
  getAll: (params) => api.get("/api/projects/admin", { params }),
  getOne: (slug) => api.get(`/api/projects/${slug}`),
  create: (formData) =>
    api.post("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/api/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/projects/${id}`),
};

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export const newsService = {
  getAll: (params) => api.get("/api/news", { params }), // public
  getAllAdmin: (params) => api.get("/api/news/admin", { params }), // dashboard
  getOne: (slug) => api.get(`/api/news/${slug}`),
  create: (formData) =>
    api.post("/api/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, fd) =>
    api.put(`/api/news/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/news/${id}`),
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const galleryService = {
  // Catégories
  getCategories: () => api.get("/api/gallery/categories"),
  createCategory: (formData) =>
    api.post("/api/gallery/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCategory: (id, formData) =>
    api.put(`/api/gallery/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteCategory: (id) => api.delete(`/api/gallery/categories/${id}`),
  // Images
  getImages: (params) => api.get("/api/gallery/images/admin", { params }),
  uploadImages: (formData) =>
    api.post("/api/gallery/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (id) => api.delete(`/api/gallery/images/${id}`),
};

// ─── PARTNERS ────────────────────────────────────────────────────────────────
export const partnersService = {
  getAll: () => api.get("/api/partners/admin"),
  create: (formData) =>
    api.post("/api/partners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/api/partners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/partners/${id}`),
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonialsService = {
  getAll: () => api.get("/api/testimonials/admin"),
  create: (formData) =>
    api.post("/api/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/api/testimonials/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/testimonials/${id}`),
};

// ─── STATISTICS ──────────────────────────────────────────────────────────────
export const statisticsService = {
  getAll: () => api.get("/api/statistics/admin"),
  create: (data) => api.post("/api/statistics", data),
  update: (id, data) => api.put(`/api/statistics/${id}`, data),
  remove: (id) => api.delete(`/api/statistics/${id}`),
};

// ─── DOMAINS ─────────────────────────────────────────────────────────────────
export const domainsService = {
  getAll: () => api.get("/api/domains/admin"),
  create: (data) => api.post("/api/domains", data),
  update: (id, data) => api.put(`/api/domains/${id}`, data),
  remove: (id) => api.delete(`/api/domains/${id}`),
};

// ─── TIMELINE ────────────────────────────────────────────────────────────────
export const timelineService = {
  getAll: () => api.get("/api/timeline/admin"),
  create: (data) => api.post("/api/timeline", data),
  update: (id, data) => api.put(`/api/timeline/${id}`, data),
  remove: (id) => api.delete(`/api/timeline/${id}`),
};
