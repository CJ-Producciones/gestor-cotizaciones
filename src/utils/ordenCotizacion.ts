import type { Producto } from "@/types/cotizacion";

const NOMBRE_SIN_SERVICIO = "Sin servicio";

export const DESPLAZAMIENTO_SERVICIO = {
  ARRIBA: -1,
  ABAJO: 1,
} as const;

export type DesplazamientoServicio =
  (typeof DESPLAZAMIENTO_SERVICIO)[keyof typeof DESPLAZAMIENTO_SERVICIO];

export interface GrupoServicioCotizacion {
  clave: string;
  servicioId: number | null;
  nombre: string;
  productos: Producto[];
}

interface ElementoConOrdenPersistido {
  id: string | number;
  orden?: number | string | null;
  created_at?: string | null;
}

const obtenerClaveServicio = (producto: Producto): string => {
  if (producto.servicioId !== null && producto.servicioId !== undefined) {
    return `id:${producto.servicioId}`;
  }

  return `nombre:${producto.nombreServicio || NOMBRE_SIN_SERVICIO}`;
};

export const agruparProductosPorServicio = (
  productos: readonly Producto[]
): GrupoServicioCotizacion[] => {
  const grupos = new Map<string, GrupoServicioCotizacion>();

  productos.forEach((producto) => {
    const clave = obtenerClaveServicio(producto);
    const grupo = grupos.get(clave);

    if (grupo) {
      grupo.productos.push(producto);
      return;
    }

    grupos.set(clave, {
      clave,
      servicioId: producto.servicioId ?? null,
      nombre: producto.nombreServicio || NOMBRE_SIN_SERVICIO,
      productos: [producto],
    });
  });

  return Array.from(grupos.values());
};

export const moverServicio = (
  productos: Producto[],
  claveServicio: string,
  desplazamiento: DesplazamientoServicio
): Producto[] => {
  const grupos = agruparProductosPorServicio(productos);
  const indiceActual = grupos.findIndex((grupo) => grupo.clave === claveServicio);
  const indiceDestino = indiceActual + desplazamiento;

  if (
    indiceActual === -1 ||
    indiceDestino < 0 ||
    indiceDestino >= grupos.length
  ) {
    return productos;
  }

  [grupos[indiceActual], grupos[indiceDestino]] = [
    grupos[indiceDestino],
    grupos[indiceActual],
  ];

  return grupos.flatMap((grupo) => grupo.productos);
};

const normalizarOrden = (orden: number | string | null | undefined): number | null => {
  if (orden === null || orden === undefined) return null;
  const valor = Number(orden);
  return Number.isFinite(valor) ? valor : null;
};

const normalizarFecha = (fecha: string | null | undefined): number => {
  if (!fecha) return 0;
  const valor = Date.parse(fecha);
  return Number.isNaN(valor) ? 0 : valor;
};

export const ordenarPorPosicionPersistida = <T extends ElementoConOrdenPersistido>(
  elementos: readonly T[]
): T[] => {
  return [...elementos].sort((a, b) => {
    const ordenA = normalizarOrden(a.orden);
    const ordenB = normalizarOrden(b.orden);

    if (ordenA !== null && ordenB !== null && ordenA !== ordenB) {
      return ordenA - ordenB;
    }
    if (ordenA !== null && ordenB === null) return -1;
    if (ordenA === null && ordenB !== null) return 1;

    const diferenciaFecha = normalizarFecha(a.created_at) - normalizarFecha(b.created_at);
    if (diferenciaFecha !== 0) return diferenciaFecha;

    return String(a.id).localeCompare(String(b.id));
  });
};
