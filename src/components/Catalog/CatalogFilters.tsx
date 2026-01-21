import React from 'react';
import { Categoria, Marca, FiltrosProducto, FiltrosDinamicos } from '../../types/catalogo.types';
import { getLogoMarcaUrl } from '../../config/api.config';
import './CatalogFilters.css';

interface CatalogFiltersProps {
  categorias: Categoria[];
  marcas: Marca[];
  filtros: FiltrosProducto;
  filtrosDinamicos: FiltrosDinamicos | null;
  onFiltrosChange: (nuevosFiltros: Partial<FiltrosProducto>) => void;
  onLimpiarFiltros: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categorias,
  marcas,
  filtros,
  filtrosDinamicos,
  onFiltrosChange,
  onLimpiarFiltros,
  isOpen,
  onClose,
}) => {
  const handleCategoriaChange = (categoriaId: number | undefined) => {
    onFiltrosChange({
      categoriaId,
      marcaId: undefined // Reset marca cuando cambia categoría
    });
  };

  const handleMarcaChange = (marcaId: number | undefined) => {
    onFiltrosChange({ marcaId });
  };

  const handleOrigenChange = (origen: string) => {
    onFiltrosChange({
      origen: filtros.origen === origen ? undefined : origen
    });
  };

  const handleEnStockChange = () => {
    onFiltrosChange({ enStock: !filtros.enStock });
  };

  const tieneFiltrosActivos = () => {
    return filtros.categoriaId || filtros.marcaId || filtros.precioMin ||
      filtros.precioMax || filtros.volumen || filtros.origen || filtros.enStock;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="filters-overlay" onClick={onClose}></div>}

      <aside className={`catalog-filters ${isOpen ? 'open' : ''}`}>
        {/* Header Mobile */}
        <div className="filters-header-mobile">
          <h3>Filtros</h3>
          <button className="filters-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Botón limpiar filtros */}
        {tieneFiltrosActivos() && (
          <button className="filters-clear" onClick={onLimpiarFiltros}>
            <i className="fas fa-eraser"></i>
            Limpiar filtros
          </button>
        )}

        {/* CATEGORÍAS */}
        <div className="filter-section">
          <h4 className="filter-title">
            <i className="fas fa-wine-bottle"></i>
            Categorías
          </h4>
          <div className="filter-options">
            <div
              className={`filter-option ${!filtros.categoriaId ? 'active' : ''}`}
              onClick={() => handleCategoriaChange(undefined)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && handleCategoriaChange(undefined)}
            >
              <span className="filter-radio"></span>
              <span>Todas las categorías</span>
            </div>
            {categorias.map((cat) => (
              <div
                key={cat.id_categoria_producto}
                className={`filter-option ${filtros.categoriaId === cat.id_categoria_producto ? 'active' : ''}`}
                onClick={() => handleCategoriaChange(cat.id_categoria_producto)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && handleCategoriaChange(cat.id_categoria_producto)}
              >
                <span className="filter-radio"></span>
                <span>{cat.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MARCAS (Solo si hay categoría seleccionada y marcas disponibles) */}
        {marcas.length > 0 && (
          <div className="filter-section">
            <h4 className="filter-title">
              <i className="fas fa-tag"></i>
              Marcas
              {filtros.categoriaId && (
                <span className="filter-badge">{marcas.length}</span>
              )}
            </h4>
            {filtros.categoriaId && (
              <p className="filter-info-text">
                <i className="fas fa-info-circle"></i>
                Mostrando marcas de la categoría seleccionada
              </p>
            )}
            <div className="filter-options filter-options--marcas">
              <div
                className={`filter-option ${!filtros.marcaId ? 'active' : ''}`}
                onClick={() => handleMarcaChange(undefined)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && handleMarcaChange(undefined)}
              >
                <span>Todas las marcas</span>
              </div>
              {marcas.map((marca) => (
                <div
                  key={marca.id_marca}
                  className={`filter-option filter-option--marca ${filtros.marcaId === marca.id_marca ? 'active' : ''}`}
                  onClick={() => handleMarcaChange(marca.id_marca)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && handleMarcaChange(marca.id_marca)}
                >
                  {marca.imagen_url && (
                    <img
                      src={getLogoMarcaUrl(marca.imagen_url)}
                      alt={marca.nombre}
                      className="marca-logo"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <span>{marca.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRECIO */}
        <div className="filter-section">
          <h4 className="filter-title">
            <i className="fas fa-dollar-sign"></i>
            Rango de Precio
          </h4>
          <div className="filter-price-range">
            <div className="price-input-group">
              <label><span className="currency-label">$</span> Desde</label>
              <input
                type="number"
                className="price-input-field"
                placeholder="0"
                value={filtros.precioMin || ''}
                onChange={(e) => {
                  const valor = e.target.value ? parseFloat(e.target.value) : undefined;
                  onFiltrosChange({ precioMin: valor });
                }}
                min="0"
                step="0.01"
              />
            </div>
            <div className="price-divider">—</div>
            <div className="price-input-group">
              <label><span className="currency-label">$</span> Hasta</label>
              <input
                type="number"
                className="price-input-field"
                placeholder="Sin límite"
                value={filtros.precioMax || ''}
                onChange={(e) => {
                  const valor = e.target.value ? parseFloat(e.target.value) : undefined;
                  onFiltrosChange({ precioMax: valor });
                }}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          {(filtros.precioMin || filtros.precioMax) && (
            <div className="price-active-filter">
              <i className="fas fa-check-circle"></i>
              <span>
                {filtros.precioMin && filtros.precioMax 
                  ? `$${filtros.precioMin} - $${filtros.precioMax}`
                  : filtros.precioMin 
                  ? `Desde $${filtros.precioMin}`
                  : `Hasta $${filtros.precioMax}`
                }
              </span>
            </div>
          )}
        </div>

        {/* ORIGEN (dinámico) */}
        {filtrosDinamicos?.origenes && filtrosDinamicos.origenes.length > 0 && (
          <div className="filter-section">
            <h4 className="filter-title">
              <i className="fas fa-globe-americas"></i>
              Origen
            </h4>
            <div className="filter-chips filter-chips--wrap">
              {filtrosDinamicos.origenes.map((origen) => (
                <button
                  key={origen}
                  className={`filter-chip ${filtros.origen === origen ? 'active' : ''}`}
                  onClick={() => handleOrigenChange(origen)}
                  tabIndex={0}
                >
                  {origen}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Aplicar filtros (Mobile) */}
        <div className="filters-apply-mobile">
          <button className="btn-aplicar" onClick={onClose}>
            Ver resultados
          </button>
        </div>
      </aside>
    </>
  );
};

export default CatalogFilters;
