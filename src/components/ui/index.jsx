// src/components/ui/index.jsx
// Composants UI réutilisables — Button, Input, Modal, Table, Badge

// ─── BUTTON ──────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  ...props
}) {
  const styles = {
    primary: { background: "#15803D", color: "white", border: "none" },
    danger: { background: "#DC2626", color: "white", border: "none" },
    secondary: {
      background: "white",
      color: "#374151",
      border: "1px solid #D1D5DB",
    },
    ghost: {
      background: "transparent",
      color: "#15803D",
      border: "1px solid #15803D",
    },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "13px" },
    md: { padding: "9px 18px", fontSize: "14px" },
    lg: { padding: "12px 24px", fontSize: "15px" },
  };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: "8px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        fontWeight: "500",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "opacity 0.2s",
        ...props.style,
      }}
    >
      {loading ? "⏳" : null}
      {children}
    </button>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "6px",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: `1px solid ${error ? "#DC2626" : "#D1D5DB"}`,
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          ...props.style,
        }}
      />
      {error && (
        <p style={{ color: "#DC2626", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── TEXTAREA ────────────────────────────────────────────────────────────────
export function Textarea({ label, error, rows = 4, ...props }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "6px",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: `1px solid ${error ? "#DC2626" : "#D1D5DB"}`,
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          resize: "vertical",
          ...props.style,
        }}
      />
      {error && (
        <p style={{ color: "#DC2626", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SELECT ──────────────────────────────────────────────────────────────────
export function Select({ label, options = [], error, ...props }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "6px",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: `1px solid ${error ? "#DC2626" : "#D1D5DB"}`,
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          background: "white",
          ...props.style,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ color: "#DC2626", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const widths = { sm: "400px", md: "600px", lg: "800px", xl: "1000px" };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: widths[size],
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
export function Badge({ children, color = "green" }) {
  const colors = {
    green: { background: "#DCFCE7", color: "#15803D" },
    red: { background: "#FEE2E2", color: "#DC2626" },
    blue: { background: "#DBEAFE", color: "#2563EB" },
    gray: { background: "#F3F4F6", color: "#6B7280" },
    yellow: { background: "#FEF3C7", color: "#D97706" },
  };
  return (
    <span
      style={{
        ...colors[color],
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {children}
    </span>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "28px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: "14px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── CARD ────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p style={{ color: "#6B7280", marginBottom: "24px" }}>{message}</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}

// ─── IMAGE PREVIEW ────────────────────────────────────────────────────────────
export function ImagePreview({ src, alt, size = 80 }) {
  if (!src)
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#F3F4F6",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        🖼️
      </div>
    );
  return (
    <img
      src={src}
      alt={alt || "preview"}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
      }}
    />
  );
}

// ─── TOGGLE PUBLISHED ────────────────────────────────────────────────────────
export function TogglePublished({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
      }}
    >
      <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
        Publié
      </label>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          background: value ? "#15803D" : "#D1D5DB",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            background: "white",
            borderRadius: "50%",
            position: "absolute",
            top: "3px",
            left: value ? "23px" : "3px",
            transition: "left 0.2s",
          }}
        />
      </div>
      <Badge color={value ? "green" : "gray"}>
        {value ? "Visible" : "Masqué"}
      </Badge>
    </div>
  );
}
