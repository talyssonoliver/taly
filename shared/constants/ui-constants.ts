import { theme } from "apps/shared-ui/src/styles/theme";

export const UIConstants = {
  // Themes
  DEFAULT_THEME: "light",
  AVAILABLE_THEMES: ["light", "dark"],

  // Layout
  DEFAULT_LAYOUT: "default",
  SUPPORTED_LAYOUTS: ["default", "compact", "sidebar"],

  // Toast Notifications
  TOAST_DEFAULT_DURATION: 5000, // 5 seconds
  TOAST_POSITION: "top-right", // Available: 'top-left', 'top-right', 'bottom-left', 'bottom-right'

  // Modals
  DEFAULT_MODAL_SIZE: "md", // Sizes: 'sm', 'md', 'lg', 'xl'
  MODAL_ANIMATION_DURATION: 300, // in milliseconds

  // Breakpoints (Reusing from theme)
  BREAKPOINTS: theme.breakpoints,

  // Colors (Reusing from theme)
  COLORS: theme.colors,

  // Typography (Reusing from theme)
  FONTS: theme.fonts,

  // Spacing (Reusing from theme)
  SPACING: theme.spacing,

  // Button Variants
  BUTTON_VARIANTS: {
    PRIMARY: `bg-${theme.colors.primary} text-white`,
    SECONDARY: `bg-${theme.colors.secondary} text-white`,
    SUCCESS: `bg-${theme.colors.success} text-white`,
    DANGER: `bg-${theme.colors.danger} text-white`,
    WARNING: `bg-${theme.colors.warning} text-white`,
    INFO: `bg-${theme.colors.info} text-white`,
  },

  // Animation Settings
  ANIMATIONS: {
    DURATION_SHORT: 150,
    DURATION_MEDIUM: 300,
    DURATION_LONG: 500,
    EASING: "ease-in-out",
  },

  // Default UI Elements
  DEFAULT_BUTTON_VARIANT: "primary",
  DEFAULT_CARD_STYLE: "elevated",

  // Loading Indicators
  LOADER_SIZE: "md", // Sizes: 'sm', 'md', 'lg'
  LOADER_COLOR: theme.colors.primary, // Default to primary color
};
