import api from "./axios";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: (password) => api.post("/api/auth/login", { password }),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get("/api/auth/me"),
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projectsService = {
  getAll: (params) => api.get("/api/projects", { params }), // public
  getAllAdmin: (params) => api.get("/api/projects/admin", { params }), // dashboard
  getOne: (slug) => api.get(`/api/projects/${slug}`),
  create: (formData) =>
    api.post("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, fd) =>
    api.put(`/api/projects/${id}`, fd, {
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
// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const galleryService = {
  getCategories: () => api.get("/api/gallery/categories"),
  createCategory: (formData) =>
    api.post("/api/gallery/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCategory: (id, fd) =>
    api.put(`/api/gallery/categories/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteCategory: (id) => api.delete(`/api/gallery/categories/${id}`),
  getImages: (params) => api.get("/api/gallery/images", { params }), // public
  getImagesAdmin: (params) => api.get("/api/gallery/images/admin", { params }), // dashboard
  uploadImages: (formData) =>
    api.post("/api/gallery/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateImage: (id, fd) =>
    api.put(`/api/gallery/images/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (id) => api.delete(`/api/gallery/images/${id}`),
};

// ─── PARTNERS ────────────────────────────────────────────────────────────────
export const partnersService = {
  getAll: () => api.get("/api/partners"), // public
  getAllAdmin: () => api.get("/api/partners/admin"), // dashboard
  create: (formData) =>
    api.post("/api/partners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, fd) =>
    api.put(`/api/partners/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/partners/${id}`),
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonialsService = {
  getAll: () => api.get("/api/testimonials"), // public
  getAllAdmin: () => api.get("/api/testimonials/admin"), // dashboard
  create: (formData) =>
    api.post("/api/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, fd) =>
    api.put(`/api/testimonials/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/api/testimonials/${id}`),
};

// ─── STATISTICS ──────────────────────────────────────────────────────────────
export const statisticsService = {
  getAll: () => api.get("/api/statistics"), // public
  getAllAdmin: () => api.get("/api/statistics/admin"), // dashboard
  create: (data) => api.post("/api/statistics", data),
  update: (id, data) => api.put(`/api/statistics/${id}`, data),
  remove: (id) => api.delete(`/api/statistics/${id}`),
};

// ─── DOMAINS ─────────────────────────────────────────────────────────────────
export const domainsService = {
  getAll: () => api.get("/api/domains"), // public
  getAllAdmin: () => api.get("/api/domains/admin"), // dashboard
  create: (data) => api.post("/api/domains", data),
  update: (id, data) => api.put(`/api/domains/${id}`, data),
  remove: (id) => api.delete(`/api/domains/${id}`),
};

// ─── TIMELINE ────────────────────────────────────────────────────────────────
export const timelineService = {
  getAll: () => api.get("/api/timeline"), // public
  getAllAdmin: () => api.get("/api/timeline/admin"), // dashboard
  create: (data) => api.post("/api/timeline", data),
  update: (id, data) => api.put(`/api/timeline/${id}`, data),
  remove: (id) => api.delete(`/api/timeline/${id}`),
};

// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
export const backgroundsService = {
  getAll: () => api.get("/api/backgrounds"), // public
  getOne: (pageKey) => api.get(`/api/backgrounds/${pageKey}`),
  update: (pageKey, formData) =>
    api.put(`/api/backgrounds/${pageKey}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  reset: (pageKey) => api.delete(`/api/backgrounds/${pageKey}`),
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────
export const contactService = {
  getAllAdmin: () => api.get("/api/contact/admin"),
  markAsRead: (id) => api.patch(`/api/contact/${id}/read`),
  remove: (id) => api.delete(`/api/contact/${id}`),
};

// ─── DONATIONS ───────────────────────────────────────────────────────────────
export const donationsService = {
  getAllAdmin: () => api.get("/api/donations/admin"),
  markAsRead: (id) => api.patch(`/api/donations/${id}/read`),
  remove: (id) => api.delete(`/api/donations/${id}`),
};

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
export const chatbotService = {
  sendMessage: (history) => api.post("/api/chatbot", { history }),
};
