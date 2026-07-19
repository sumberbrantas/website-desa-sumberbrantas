import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { FiAlertTriangle, FiHelpCircle, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

const BRAND_COLOR = "#1B3A6D";
const BRAND_COLOR_HOVER = "#152f5a";

const createIconHtml = (IconComponent: React.ComponentType<any>, color: string) => {
  return ReactDOMServer.renderToString(
    React.createElement(IconComponent, {
      size: 48,
      color,
      style: { display: "block", margin: "0 auto" },
    })
  );
};

const getIconHtml = (type: "warning" | "question" | "success" | "error" | "info") => {
  switch (type) {
    case "warning":
      return createIconHtml(FiAlertTriangle, "#f59e0b");
    case "question":
      return createIconHtml(FiHelpCircle, BRAND_COLOR);
    case "success":
      return createIconHtml(FiCheckCircle, "#10b981");
    case "error":
      return createIconHtml(FiXCircle, "#ef4444");
    case "info":
      return createIconHtml(FiInfo, BRAND_COLOR);
    default:
      return createIconHtml(FiHelpCircle, BRAND_COLOR);
  }
};

const createCustomContent = (iconType: "warning" | "question" | "success" | "error" | "info", title: string, text: string) => {
  return `
    <div class="custom-icon-container">
      ${getIconHtml(iconType)}
    </div>
    <div class="swal2-compact-title">${title}</div>
    <div class="swal2-compact-text">${text}</div>
  `;
};

const getCustomStyles = () => ({
  customClass: {
    popup: "swal2-compact-popup",
    title: "swal2-compact-title",
    htmlContainer: "swal2-compact-text",
    confirmButton: "swal2-compact-button swal2-compact-confirm",
    cancelButton: "swal2-compact-button swal2-compact-cancel",
  },
  didOpen: () => {
    const style = document.createElement("style");
    style.textContent = `
      .swal2-compact-popup {
        border-radius: 8px !important;
        padding: 1rem !important;
        width: 320px !important;
        max-width: 90vw !important;
      }
      .swal2-compact-title {
        font-size: 16px !important;
        font-weight: 600 !important;
        color: #1f2937 !important;
        margin: 0 0 0.5rem 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important;
      }
      .swal2-compact-text {
        font-size: 13px !important;
        color: #6b7280 !important;
        margin: 0 0 1rem 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important;
      }
      .swal2-compact-button {
        font-size: 13px !important;
        padding: 6px 14px !important;
        border-radius: 6px !important;
        font-weight: 500 !important;
        margin: 0 4px !important;
        min-height: 32px !important;
        border: none !important;
      }
      .swal2-compact-confirm {
        background-color: ${BRAND_COLOR} !important;
        color: white !important;
      }
      .swal2-compact-confirm:hover {
        background-color: ${BRAND_COLOR_HOVER} !important;
      }
      .swal2-compact-cancel {
        background-color: #6b7280 !important;
        color: white !important;
      }
      .swal2-compact-cancel:hover {
        background-color: #4b5563 !important;
      }
      .swal2-actions {
        margin: 0 !important;
        padding: 0 !important;
        justify-content: center !important;
      }
      .swal2-icon {
        display: none !important;
      }
      .custom-icon-container {
        display: flex !important;
        justify-content: center !important;
        margin: 0 auto 0.75rem auto !important;
        width: 48px !important;
        height: 48px !important;
      }
      .custom-icon-container svg {
        width: 48px !important;
        height: 48px !important;
      }
    `;
    document.head.appendChild(style);
  },
});

export const confirmDelete = async (title: string = "Hapus Data?", text: string = "Data yang dihapus tidak dapat dikembalikan!", confirmButtonText: string = "Ya, Hapus!"): Promise<boolean> => {
  const result = await Swal.fire({
    html: createCustomContent("warning", title, text),
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText,
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    ...getCustomStyles(),
  });

  return result.isConfirmed;
};

export const confirmLogout = async (): Promise<boolean> => {
  const result = await Swal.fire({
    html: createCustomContent("question", "Keluar dari Dashboard?", "Anda akan dialihkan ke halaman login."),
    showCancelButton: true,
    confirmButtonColor: BRAND_COLOR,
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Keluar",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    ...getCustomStyles(),
  });

  return result.isConfirmed;
};

export const confirmStatusChange = async (newStatus: string, itemName: string = "item"): Promise<boolean> => {
  const result = await Swal.fire({
    html: createCustomContent("question", `Ubah Status ${itemName}?`, `Status akan diubah menjadi "${newStatus}".`),
    showCancelButton: true,
    confirmButtonColor: BRAND_COLOR,
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Ubah",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    ...getCustomStyles(),
  });

  return result.isConfirmed;
};

export const confirmRoleChange = async (newRole: string, userName: string): Promise<boolean> => {
  const result = await Swal.fire({
    html: createCustomContent("question", "Ubah Role Pengguna?", `Role ${userName} akan diubah menjadi "${newRole}".`),
    showCancelButton: true,
    confirmButtonColor: BRAND_COLOR,
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Ubah Role",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    ...getCustomStyles(),
  });

  return result.isConfirmed;
};

export const confirmAction = async (title: string, text: string, confirmButtonText: string = "Ya", icon: "warning" | "question" | "info" = "question"): Promise<boolean> => {
  const result = await Swal.fire({
    html: createCustomContent(icon, title, text),
    showCancelButton: true,
    confirmButtonColor: BRAND_COLOR,
    cancelButtonColor: "#6b7280",
    confirmButtonText,
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    ...getCustomStyles(),
  });

  return result.isConfirmed;
};

export const showSuccess = (title: string = "Berhasil!", text: string = "Operasi berhasil dilakukan.", timer: number = 2000): void => {
  Swal.fire({
    html: createCustomContent("success", title, text),
    timer,
    showConfirmButton: false,
    buttonsStyling: false,
    ...getCustomStyles(),
  });
};

export const showError = (title: string = "Terjadi Kesalahan!", text: string = "Silakan coba lagi.", confirmButtonText: string = "OK"): void => {
  Swal.fire({
    html: createCustomContent("error", title, text),
    confirmButtonColor: "#ef4444",
    confirmButtonText,
    buttonsStyling: false,
    ...getCustomStyles(),
  });
};

export const showInfo = (title: string, text: string, confirmButtonText: string = "OK"): void => {
  Swal.fire({
    html: createCustomContent("info", title, text),
    confirmButtonColor: BRAND_COLOR,
    confirmButtonText,
    buttonsStyling: false,
    ...getCustomStyles(),
  });
};

