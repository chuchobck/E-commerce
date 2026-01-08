import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Producto, ItemCarrito } from '../types/catalogo.types';
import { carritoService, Carrito as CarritoAPI } from '../services/carrito.service';

interface CarritoContextType {
  items: ItemCarrito[];
  totalItems: number;
  totalPrecio: number;
  carritoId: string | null;
  isLoading: boolean;
  error: string | null;
  sincronizado: boolean;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Promise<void>;
  removerDelCarrito: (idProducto: string) => Promise<void>;
  actualizarCantidad: (idProducto: string, cantidad: number) => Promise<void>;
  limpiarCarrito: () => Promise<void>;
  estaEnCarrito: (idProducto: string) => boolean;
  sincronizarConAPI: () => Promise<void>;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

interface CarritoProviderProps {
  children: ReactNode;
  usuarioId?: number;
}

const CARRITO_STORAGE_KEY = 'barbox_carrito';
const CARRITO_ID_KEY = 'barbox_carrito_id';

export const CarritoProvider: React.FC<CarritoProviderProps> = ({ children, usuarioId }) => {
  const [items, setItems] = useState<ItemCarrito[]>(() => {
    const saved = localStorage.getItem(CARRITO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [carritoId, setCarritoId] = useState<string | null>(() => {
    return localStorage.getItem(CARRITO_ID_KEY);
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sincronizado, setSincronizado] = useState(false);
  
  // Ref para trackear el último usuarioId
  const ultimoUsuarioIdRef = useRef<number | undefined>(undefined);

  // Guardar items en localStorage
  useEffect(() => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Guardar carritoId en localStorage
  useEffect(() => {
    if (carritoId) {
      localStorage.setItem(CARRITO_ID_KEY, carritoId);
    } else {
      localStorage.removeItem(CARRITO_ID_KEY);
    }
  }, [carritoId]);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  
  const totalPrecio = items.reduce((sum, item) => {
    return sum + (Number(item.producto.precio_venta) * item.cantidad);
  }, 0);

  // Convertir respuesta de API a items del carrito
  const convertirCarritoAPI = useCallback((carritoAPI: CarritoAPI): ItemCarrito[] => {
    if (!carritoAPI || !carritoAPI.carrito_detalle) {
      return [];
    }
    return carritoAPI.carrito_detalle.map(detalle => ({
      producto: {
        id_producto: detalle.producto.id_producto,
        descripcion: detalle.producto.descripcion,
        precio_venta: detalle.producto.precio_venta,
        imagen_url: detalle.producto.imagen_url,
        saldo_actual: detalle.producto.saldo_actual,
        estado: detalle.producto.estado,
        id_marca: detalle.producto.marca?.id_marca
      } as Producto,
      cantidad: detalle.cantidad
    }));
  }, []);

  // Función de sincronización
  const sincronizarConAPI = useCallback(async () => {
    console.log('🛒 sincronizarConAPI - usuarioId:', usuarioId, 'carritoId:', carritoId);
    
    if (!usuarioId && !carritoId) {
      console.log('🛒 Sin usuarioId ni carritoId, usando localStorage');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (usuarioId) {
        console.log('🛒 Obteniendo carrito para usuario:', usuarioId);
        let carritoAPI = await carritoService.obtenerCarrito(usuarioId);
        console.log('🛒 Respuesta obtenerCarrito:', carritoAPI);

        // Obtener items locales ANTES de cualquier operación
        const itemsLocales = JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY) || '[]');
        console.log('🛒 Items locales encontrados:', itemsLocales.length);

        if (!carritoAPI) {
          console.log('🛒 No hay carrito, creando uno nuevo...');
          carritoAPI = await carritoService.crearCarrito(usuarioId, 'WEB');
          console.log('🛒 Carrito creado:', carritoAPI);
        }
        
        setCarritoId(carritoAPI.id_carrito);

        // ✅ SIEMPRE sincronizar items locales al carrito del servidor
        if (itemsLocales.length > 0) {
          console.log('🛒 Sincronizando items locales al servidor:', itemsLocales);
          for (const item of itemsLocales) {
            try {
              await carritoService.agregarProducto(
                carritoAPI.id_carrito,
                item.producto.id_producto,
                item.cantidad,
                Number(item.producto.precio_venta)
              );
            } catch (err) {
              console.warn('⚠️ Error agregando producto:', item.producto.id_producto, err);
            }
          }
          // Limpiar localStorage después de sincronizar
          localStorage.removeItem(CARRITO_STORAGE_KEY);
          // Recargar carrito actualizado
          carritoAPI = await carritoService.obtenerCarrito(usuarioId);
          console.log('🛒 Carrito actualizado después de sincronizar:', carritoAPI);
        }

        if (carritoAPI) {
          const nuevosItems = convertirCarritoAPI(carritoAPI);
          console.log('🛒 Items del carrito:', nuevosItems);
          setItems(nuevosItems);
        }
      } else if (carritoId) {
        console.log('🛒 Obteniendo carrito por ID:', carritoId);
        const carritoAPI = await carritoService.obtenerCarritoPorId(carritoId);
        if (carritoAPI) {
          setItems(convertirCarritoAPI(carritoAPI));
        }
      }

      setSincronizado(true);
      console.log('🛒 Sincronización completada');
    } catch (err: any) {
      console.error('❌ Error al sincronizar carrito:', err);
      setError(err.message || 'Error al sincronizar carrito');
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId, carritoId, convertirCarritoAPI]);

  // Efecto para detectar cambios en usuarioId (login/logout)
  useEffect(() => {
    const anteriorUsuarioId = ultimoUsuarioIdRef.current;
    console.log('🛒 useEffect usuarioId - anterior:', anteriorUsuarioId, 'nuevo:', usuarioId);
    
    // Si el usuario cambió
    if (usuarioId !== anteriorUsuarioId) {
      ultimoUsuarioIdRef.current = usuarioId;
      
      if (usuarioId) {
        // Usuario hizo login
        console.log('🛒 Usuario hizo LOGIN, sincronizando...');
        setSincronizado(false);
        sincronizarConAPI();
      } else if (anteriorUsuarioId) {
        // Usuario hizo logout
        console.log('🛒 Usuario hizo LOGOUT, limpiando...');
        setCarritoId(null);
        setItems([]);
        setSincronizado(false);
      }
    }
  }, [usuarioId, sincronizarConAPI]);

  const agregarAlCarrito = async (producto: Producto, cantidad: number = 1) => {
    console.log('🛒 agregarAlCarrito - producto:', producto.id_producto, 'cantidad:', cantidad, 'carritoId:', carritoId, 'usuarioId:', usuarioId);
    
    setIsLoading(true);
    setError(null);

    try {
      // Si existe un carritoId (incluso sin usuario), usar API
      if (carritoId) {
        console.log('🛒 Agregando via API con carritoId:', carritoId);
        const carritoActualizado = await carritoService.agregarProducto(
          carritoId,
          producto.id_producto,
          cantidad,
          Number(producto.precio_venta)
        );
        console.log('🛒 Producto agregado, respuesta:', carritoActualizado);
        setItems(convertirCarritoAPI(carritoActualizado));
      } else if (usuarioId) {
        // Usuario autenticado pero sin carritoId: crear y agregar
        console.log('🛒 Usuario sin carritoId, obteniendo/creando carrito...');
        let carritoAPI = await carritoService.obtenerCarrito(usuarioId);
        if (!carritoAPI) {
          carritoAPI = await carritoService.crearCarrito(usuarioId, 'WEB');
        }
        setCarritoId(carritoAPI.id_carrito);
        
        console.log('🛒 Agregando producto al carrito:', carritoAPI.id_carrito);
        const carritoActualizado = await carritoService.agregarProducto(
          carritoAPI.id_carrito,
          producto.id_producto,
          cantidad,
          Number(producto.precio_venta)
        );
        setItems(convertirCarritoAPI(carritoActualizado));
      } else {
        console.log('🛒 Sin usuario ni carritoId, guardando en localStorage');
        setItems(prev => {
          const existente = prev.find(item => item.producto.id_producto === producto.id_producto);
          
          if (existente) {
            return prev.map(item =>
              item.producto.id_producto === producto.id_producto
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            );
          }
          
          return [...prev, { producto, cantidad }];
        });
      }
    } catch (err: any) {
      console.error('❌ Error al agregar producto:', err);
      setError(err.message || 'Error al agregar producto');
      
      // Fallback a localStorage
      setItems(prev => {
        const existente = prev.find(item => item.producto.id_producto === producto.id_producto);
        if (existente) {
          return prev.map(item =>
            item.producto.id_producto === producto.id_producto
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        }
        return [...prev, { producto, cantidad }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removerDelCarrito = async (idProducto: string) => {
    console.log('🛒 removerDelCarrito - producto:', idProducto, 'carritoId:', carritoId);
    
    setIsLoading(true);
    setError(null);

    try {
      if (carritoId) {
        console.log('🛒 Eliminando producto via API...');
        const carritoActualizado = await carritoService.eliminarProducto(carritoId, idProducto);
        console.log('🛒 Producto eliminado, respuesta:', carritoActualizado);
        setItems(convertirCarritoAPI(carritoActualizado));
      } else {
        setItems(prev => prev.filter(item => item.producto.id_producto !== idProducto));
      }
    } catch (err: any) {
      console.error('❌ Error al remover producto:', err);
      setError(err.message || 'Error al remover producto');
      setItems(prev => prev.filter(item => item.producto.id_producto !== idProducto));
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarCantidad = async (idProducto: string, cantidad: number) => {
    console.log('🛒 actualizarCantidad - producto:', idProducto, 'cantidad:', cantidad, 'carritoId:', carritoId);
    
    if (cantidad <= 0) {
      await removerDelCarrito(idProducto);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (carritoId) {
        console.log('🛒 Actualizando cantidad via API...');
        const carritoActualizado = await carritoService.actualizarCantidad(
          carritoId,
          idProducto,
          cantidad
        );
        console.log('🛒 Cantidad actualizada, respuesta:', carritoActualizado);
        setItems(convertirCarritoAPI(carritoActualizado));
      } else {
        setItems(prev =>
          prev.map(item =>
            item.producto.id_producto === idProducto
              ? { ...item, cantidad }
              : item
          )
        );
      }
    } catch (err: any) {
      console.error('❌ Error al actualizar cantidad:', err);
      setError(err.message || 'Error al actualizar cantidad');
      setItems(prev =>
        prev.map(item =>
          item.producto.id_producto === idProducto
            ? { ...item, cantidad }
            : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarCarrito = async () => {
    console.log('🛒 limpiarCarrito - carritoId:', carritoId);
    
    setIsLoading(true);
    setError(null);

    try {
      if (carritoId) {
        console.log('🛒 Vaciando carrito via API...');
        await carritoService.vaciarCarrito(carritoId);
        console.log('🛒 Carrito vaciado');
      }
      setItems([]);
    } catch (err: any) {
      console.error('❌ Error al limpiar carrito:', err);
      setError(err.message || 'Error al limpiar carrito');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const estaEnCarrito = (idProducto: string): boolean => {
    return items.some(item => item.producto.id_producto === idProducto);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        totalItems,
        totalPrecio,
        carritoId,
        isLoading,
        error,
        sincronizado,
        agregarAlCarrito,
        removerDelCarrito,
        actualizarCantidad,
        limpiarCarrito,
        estaEnCarrito,
        sincronizarConAPI,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
