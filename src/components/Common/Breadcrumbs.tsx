// src/components/Common/Breadcrumbs.tsx
// Navegación de migas de pan - Heurística #1, #2 y #6: Visibilidad, Metáforas Visuales y Reconocimiento
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon, type IconKey } from '../../utils/iconMap';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  autoGenerate?: boolean;
}

// Mapeo de rutas a nombres legibles - Ahora usando iconMap
const routeLabels: Record<string, { label: string; iconKey: IconKey }> = {
  '': { label: 'Inicio', iconKey: 'home' },
  'catalogo': { label: 'Catálogo', iconKey: 'menu' },
  'producto': { label: 'Producto', iconKey: 'package' },
  'carrito': { label: 'Carrito', iconKey: 'cart' },
  'checkout': { label: 'Checkout', iconKey: 'checkout' },
  'login': { label: 'Iniciar Sesión', iconKey: 'login' },
  'register': { label: 'Registro', iconKey: 'user' },
  'cuenta': { label: 'Mi Cuenta', iconKey: 'user' },
  'pedidos': { label: 'Mis Pedidos', iconKey: 'package' },
  'favoritos': { label: 'Favoritos', iconKey: 'heart' },
  'buscar': { label: 'Búsqueda', iconKey: 'search' },
  'ofertas': { label: 'Ofertas', iconKey: 'tag' },
  'contacto': { label: 'Contacto', iconKey: 'phone' },
  'ayuda': { label: 'Ayuda', iconKey: 'help' },
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  autoGenerate = true
}) => {
  const location = useLocation();

  // Generar breadcrumbs automáticamente desde la URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Inicio',
        path: '/',
        icon: 'fa-home'
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeLabels[segment] || { 
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        iconKey: 'forward' as IconKey
      };

      breadcrumbs.push({
        label: routeInfo.label,
        path: index < pathSegments.length - 1 ? currentPath : undefined,
        icon: getIcon(routeInfo.iconKey)
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || (autoGenerate ? generateBreadcrumbs() : []);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="Navegación de migas de pan">
      <ol className="breadcrumbs__list" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li 
              key={`${item.label}-${index}`}
              className={`breadcrumbs__item ${isLast ? 'breadcrumbs__item--current' : ''}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.path && !isLast ? (
                <>
                  <Link 
                    to={item.path}
                    className="breadcrumbs__link"
                    itemProp="item"
                  >
                    {item.icon && <i className={`fas ${item.icon} breadcrumbs__icon`}></i>}
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                </>
              ) : (
                <>
                  <span 
                    className="breadcrumbs__current"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.icon && <i className={`fas ${item.icon} breadcrumbs__icon`}></i>}
                    {item.label}
                  </span>
                  <meta itemProp="position" content={String(index + 1)} />
                </>
              )}

              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  <i className="fas fa-chevron-right"></i>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Indicador de ubicación actual */}
      <div className="breadcrumbs__context">
        <span className="breadcrumbs__context-label">
          Estás en: <strong>{breadcrumbItems[breadcrumbItems.length - 1]?.label}</strong>
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
