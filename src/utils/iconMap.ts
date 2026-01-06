// src/utils/iconMap.ts
// Sistema de mapeo de iconos intuitivos - Heurística #2
// Asegura que los iconos sean reconocibles y consistentes

export const ICON_MAP = {
  // Navegación
  home: 'fa-home',
  back: 'fa-arrow-left',
  forward: 'fa-arrow-right',
  menu: 'fa-bars',
  close: 'fa-times',
  search: 'fa-search',
  
  // Carrito y Compra
  cart: 'fa-shopping-cart',
  checkout: 'fa-credit-card',
  bag: 'fa-shopping-bag',
  package: 'fa-box',
  truck: 'fa-truck',
  
  // Favoritos y Productos
  heart: 'fa-heart',
  heartOutline: 'fa-heart-outline',
  star: 'fa-star',
  starOutline: 'fa-star-outline',
  product: 'fa-cube',
  
  // Categorías
  beer: 'fa-beer',
  wine: 'fa-wine-bottle',
  whisky: 'fa-glass-whiskey',
  
  // Usuarios y Cuentas
  user: 'fa-user',
  login: 'fa-sign-in-alt',
  logout: 'fa-sign-out-alt',
  profile: 'fa-user-circle',
  
  // Estados y Acciones
  success: 'fa-check-circle',
  error: 'fa-times-circle',
  warning: 'fa-exclamation-triangle',
  info: 'fa-info-circle',
  loading: 'fa-spinner fa-spin',
  
  // Acciones
  add: 'fa-plus',
  remove: 'fa-minus',
  delete: 'fa-trash',
  edit: 'fa-edit',
  copy: 'fa-copy',
  download: 'fa-download',
  share: 'fa-share-alt',
  
  // Filtros y Búsqueda
  filter: 'fa-filter',
  sort: 'fa-sort',
  tag: 'fa-tag',
  
  // Comunicación
  phone: 'fa-phone',
  email: 'fa-envelope',
  chat: 'fa-comments',
  help: 'fa-question-circle',
  
  // Miscelánea
  settings: 'fa-cog',
  notification: 'fa-bell',
  bookmark: 'fa-bookmark',
  flag: 'fa-flag',
  lock: 'fa-lock',
  unlock: 'fa-unlock',
  eye: 'fa-eye',
  eyeOff: 'fa-eye-slash',
  fire: 'fa-fire',
  clock: 'fa-clock',
  keyboard: 'fa-keyboard',
  lightbulb: 'fa-lightbulb'
} as const;

export type IconKey = keyof typeof ICON_MAP;

/**
 * Obtiene la clase de FontAwesome para un icono
 */
export const getIcon = (key: IconKey): string => {
  return ICON_MAP[key];
};

/**
 * Sistema de categorías con iconos intuitivos
 */
export const CATEGORY_ICONS: Record<string, IconKey> = {
  cerveza: 'beer',
  cervezas: 'beer',
  vino: 'wine',
  vinos: 'wine',
  whisky: 'whisky',
  whiskeys: 'whisky',
  ron: 'whisky',
  vodka: 'whisky',
  champagne: 'wine',
  champagnes: 'wine',
  licores: 'whisky',
  default: 'product'
};

/**
 * Obtiene el icono para una categoría
 */
export const getCategoryIcon = (categoryName?: string): string => {
  if (!categoryName) return getIcon('product');
  
  const normalized = categoryName.toLowerCase();
  const iconKey = Object.entries(CATEGORY_ICONS).find(
    ([key]) => normalized.includes(key)
  )?.[1] || 'product' as IconKey;
  
  return getIcon(iconKey);
};

/**
 * Colores semanticos para estados
 */
export const STATE_COLORS = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  primary: '#c9a227',
  secondary: '#6c757d'
} as const;

/**
 * Combinaciones recomendadas de icono + color
 */
export const SEMANTIC_ICONS = {
  success: {
    icon: 'success',
    color: STATE_COLORS.success,
    label: 'Éxito'
  },
  error: {
    icon: 'error',
    color: STATE_COLORS.error,
    label: 'Error'
  },
  warning: {
    icon: 'warning',
    color: STATE_COLORS.warning,
    label: 'Advertencia'
  },
  info: {
    icon: 'info',
    color: STATE_COLORS.info,
    label: 'Información'
  },
  pending: {
    icon: 'loading',
    color: STATE_COLORS.primary,
    label: 'Cargando'
  }
} as const;

export default {
  ICON_MAP,
  getIcon,
  getCategoryIcon,
  STATE_COLORS,
  SEMANTIC_ICONS
};
