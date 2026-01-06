import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { favoritosService } from '../services/favoritos.service';
import { Favorito } from '../types/catalogo.types';

interface FavoritosContextType {
  favoritos: string[];
  favoritosCompletos: Favorito[];
  totalFavoritos: number;
  isLoading: boolean;
  error: string | null;
  sincronizado: boolean;
  agregarFavorito: (idProducto: string) => Promise<void>;
  removerFavorito: (idProducto: string) => Promise<void>;
  toggleFavorito: (idProducto: string) => Promise<void>;
  esFavorito: (idProducto: string) => boolean;
  limpiarFavoritos: () => Promise<void>;
  sincronizarConAPI: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  }
  return context;
};

interface FavoritosProviderProps {
  children: ReactNode;
  usuarioId?: number;
}

const FAVORITOS_STORAGE_KEY = 'barbox_favoritos';

export const FavoritosProvider: React.FC<FavoritosProviderProps> = ({ children, usuarioId }) => {
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const saved = localStorage.getItem(FAVORITOS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritosCompletos, setFavoritosCompletos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sincronizado, setSincronizado] = useState(false);
  
  // Ref para rastrear el último usuarioId procesado
  const ultimoUsuarioIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(favoritos));
  }, [favoritos]);

  const totalFavoritos = favoritos.length;

  // Función de sincronización con useCallback para evitar recreación
  const sincronizarConAPI = useCallback(async () => {
    console.log('❤️ sincronizarConAPI - usuarioId:', usuarioId);
    
    if (!usuarioId) {
      console.log('❤️ Sin usuarioId, no se sincroniza');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('❤️ Llamando obtenerFavoritos para usuario:', usuarioId);
      const favoritosAPI = await favoritosService.obtenerFavoritos(usuarioId);
      console.log('❤️ Favoritos recibidos de API:', favoritosAPI);
      
      setFavoritosCompletos(favoritosAPI);
      const idsProductos = favoritosAPI.map(f => f.id_producto);
      setFavoritos(idsProductos);
      console.log('❤️ IDs de productos favoritos:', idsProductos);

      // Sincronizar favoritos locales con el backend
      const saved = localStorage.getItem(FAVORITOS_STORAGE_KEY);
      const favoritosLocales: string[] = saved ? JSON.parse(saved) : [];
      const favoritosEnAPI = new Set(idsProductos);
      
      console.log('❤️ Favoritos locales a sincronizar:', favoritosLocales);
      
      for (const idProducto of favoritosLocales) {
        if (!favoritosEnAPI.has(idProducto)) {
          try {
            console.log('❤️ Agregando favorito local al backend:', idProducto);
            await favoritosService.agregarFavorito(usuarioId, idProducto);
          } catch (err) {
            console.error('Error al sincronizar favorito:', idProducto, err);
          }
        }
      }

      setSincronizado(true);
      console.log('❤️ Sincronización completada');
    } catch (err: any) {
      console.error('❌ Error al sincronizar favoritos:', err);
      setError(err.message || 'Error al sincronizar favoritos');
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId]);

  // Detectar LOGIN/LOGOUT
  useEffect(() => {
    const anteriorUsuarioId = ultimoUsuarioIdRef.current;
    console.log('❤️ useEffect usuarioId - anterior:', anteriorUsuarioId, 'nuevo:', usuarioId);

    if (usuarioId !== anteriorUsuarioId) {
      ultimoUsuarioIdRef.current = usuarioId;

      if (usuarioId) {
        // LOGIN: Sincronizar con API
        console.log('❤️ Usuario hizo LOGIN, sincronizando favoritos...');
        sincronizarConAPI();
      } else if (anteriorUsuarioId) {
        // LOGOUT: Limpiar favoritos
        console.log('❤️ Usuario hizo LOGOUT, limpiando favoritos...');
        setFavoritos([]);
        setFavoritosCompletos([]);
        setSincronizado(false);
      }
    }
  }, [usuarioId, sincronizarConAPI]);

  const agregarFavorito = async (idProducto: string) => {
    console.log('❤️ agregarFavorito - producto:', idProducto, 'usuarioId:', usuarioId);
    
    setIsLoading(true);
    setError(null);

    try {
      if (usuarioId) {
        console.log('❤️ Agregando favorito via API...');
        const favorito = await favoritosService.agregarFavorito(usuarioId, idProducto);
        console.log('❤️ Favorito agregado:', favorito);
        setFavoritosCompletos(prev => [...prev, favorito]);
        setFavoritos(prev => {
          if (prev.includes(idProducto)) return prev;
          return [...prev, idProducto];
        });
      } else {
        console.log('❤️ Sin usuario, guardando en localStorage');
        setFavoritos(prev => {
          if (prev.includes(idProducto)) return prev;
          return [...prev, idProducto];
        });
      }
    } catch (err: any) {
      console.error('❌ Error al agregar favorito:', err);
      setError(err.message || 'Error al agregar favorito');
      
      // Fallback: agregar solo localmente
      setFavoritos(prev => {
        if (prev.includes(idProducto)) return prev;
        return [...prev, idProducto];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removerFavorito = async (idProducto: string) => {
    console.log('❤️ removerFavorito - producto:', idProducto, 'usuarioId:', usuarioId);
    
    setIsLoading(true);
    setError(null);

    try {
      if (usuarioId) {
        const favorito = favoritosCompletos.find(f => f.id_producto === idProducto);
        if (favorito) {
          console.log('❤️ Eliminando favorito via API, id_favorito:', favorito.id_favorito);
          await favoritosService.eliminarFavorito(favorito.id_favorito);
          console.log('❤️ Favorito eliminado');
          setFavoritosCompletos(prev => prev.filter(f => f.id_producto !== idProducto));
        }
      }
      
      setFavoritos(prev => prev.filter(id => id !== idProducto));
    } catch (err: any) {
      console.error('❌ Error al remover favorito:', err);
      setError(err.message || 'Error al remover favorito');
      
      // Fallback: remover localmente
      setFavoritos(prev => prev.filter(id => id !== idProducto));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorito = async (idProducto: string) => {
    console.log('❤️ toggleFavorito - producto:', idProducto, 'esFavorito:', favoritos.includes(idProducto));
    
    if (favoritos.includes(idProducto)) {
      await removerFavorito(idProducto);
    } else {
      await agregarFavorito(idProducto);
    }
  };

  const esFavorito = (idProducto: string): boolean => {
    return favoritos.includes(idProducto);
  };

  const limpiarFavoritos = async () => {
    console.log('❤️ limpiarFavoritos - usuarioId:', usuarioId, 'total:', favoritosCompletos.length);
    
    setIsLoading(true);
    setError(null);

    try {
      if (usuarioId && favoritosCompletos.length > 0) {
        console.log('❤️ Eliminando favoritos via API...');
        for (const favorito of favoritosCompletos) {
          try {
            await favoritosService.eliminarFavorito(favorito.id_favorito);
          } catch (err) {
            console.error('Error al eliminar favorito:', favorito.id_favorito, err);
          }
        }
      }
      
      setFavoritos([]);
      setFavoritosCompletos([]);
      console.log('❤️ Favoritos limpiados');
    } catch (err: any) {
      console.error('❌ Error al limpiar favoritos:', err);
      setError(err.message || 'Error al limpiar favoritos');
      
      // Limpiar localmente de todos modos
      setFavoritos([]);
      setFavoritosCompletos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        favoritosCompletos,
        totalFavoritos,
        isLoading,
        error,
        sincronizado,
        agregarFavorito,
        removerFavorito,
        toggleFavorito,
        esFavorito,
        limpiarFavoritos,
        sincronizarConAPI,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext;
