import { create } from "zustand";

export const useThemeStore = create((set) => {
  const storedTheme = localStorage.getItem("chat-theme") || "coffee";

  // Ensure theme is set on initial load
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", storedTheme);
  }

  return {
    theme: storedTheme,
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      document.documentElement.setAttribute("data-theme", theme); // Apply globally
      set({ theme });
    },
  };
});
