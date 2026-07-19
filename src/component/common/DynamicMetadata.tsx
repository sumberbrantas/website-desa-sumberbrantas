"use client";

import { useEffect } from "react";

const SETTINGS_KEY = 'mock_village_settings';

export default function DynamicMetadata() {
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');

    // Update title
    if (settings.villageName) {
      let titleEl = document.querySelector('title');
      if (!titleEl) {
        titleEl = document.createElement('title');
        document.head.appendChild(titleEl);
      }
      titleEl.textContent = `${settings.villageName} - Website Resmi`;
    }

    // Update favicon with cache busting
    const iconUrl = settings.iconUrl || settings.logoUrl;
    if (iconUrl) {
      const head = document.head;

      // Remove old favicon links
      const oldLinks = head.querySelectorAll('link[rel="icon"], link[rel="shortcut"]');
      oldLinks.forEach(link => link.remove());

      // Add new favicon with cache busting
      const iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.href = iconUrl;
      head.appendChild(iconLink);

      // Also set as shortcut icon
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = iconUrl;
      head.appendChild(shortcutLink);
    }
  }, []);

  return null;
}
