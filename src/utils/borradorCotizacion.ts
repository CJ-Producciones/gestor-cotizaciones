import type { DatosCotizacion, Producto } from "@/types/cotizacion";

const BORRADOR_VERSION = 1;
const BORRADOR_STORAGE_PREFIX = "cj-cotizacion-borrador";

export interface EstadoBorradorCotizacion {
  datos: DatosCotizacion;
  ivaHabilitado: boolean;
  ivaGuardado: number;
  servicioSeleccionado: string;
}

interface BorradorCotizacionPersistido extends EstadoBorradorCotizacion {
  version: typeof BORRADOR_VERSION;
  actualizadoEn: number;
}

const esRegistro = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === "object" && valor !== null;

const esNumeroFinito = (valor: unknown): valor is number =>
  typeof valor === "number" && Number.isFinite(valor);

const esNumeroOpcional = (valor: unknown) =>
  valor === undefined || valor === null || esNumeroFinito(valor);

const esTextoOpcional = (valor: unknown) =>
  valor === undefined || valor === null || typeof valor === "string";

const esProducto = (valor: unknown): valor is Producto => {
  if (!esRegistro(valor)) return false;

  return (
    typeof valor.id === "string" &&
    typeof valor.descripcion === "string" &&
    esNumeroFinito(valor.cantidad) &&
    esNumeroFinito(valor.precioUnitario) &&
    esNumeroOpcional(valor.productoId) &&
    esNumeroOpcional(valor.servicioId) &&
    esTextoOpcional(valor.nombreServicio) &&
    esTextoOpcional(valor.descripcionProducto)
  );
};

const esDatosCotizacion = (valor: unknown): valor is DatosCotizacion => {
  if (!esRegistro(valor)) return false;

  return (
    typeof valor.cliente === "string" &&
    typeof valor.evento === "string" &&
    typeof valor.lugar === "string" &&
    typeof valor.notas === "string" &&
    esNumeroFinito(valor.descuento) &&
    (valor.iva === undefined || esNumeroFinito(valor.iva)) &&
    typeof valor.fecha === "string" &&
    typeof valor.nombreEncargado === "string" &&
    typeof valor.cargo === "string" &&
    Array.isArray(valor.productos) &&
    valor.productos.every(esProducto)
  );
};

const esBorradorPersistido = (valor: unknown): valor is BorradorCotizacionPersistido => {
  if (!esRegistro(valor)) return false;

  return (
    valor.version === BORRADOR_VERSION &&
    esNumeroFinito(valor.actualizadoEn) &&
    esDatosCotizacion(valor.datos) &&
    typeof valor.ivaHabilitado === "boolean" &&
    esNumeroFinito(valor.ivaGuardado) &&
    typeof valor.servicioSeleccionado === "string"
  );
};

const obtenerStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const crearDatosCotizacionVacios = (): DatosCotizacion => ({
  cliente: "",
  evento: "",
  lugar: "",
  notas: "",
  descuento: 0,
  iva: 19,
  fecha: "",
  nombreEncargado: "Carlos Jaramillo",
  cargo: "Director general",
  productos: [],
});

export const crearEstadoBorradorVacio = (): EstadoBorradorCotizacion => ({
  datos: crearDatosCotizacionVacios(),
  ivaHabilitado: true,
  ivaGuardado: 19,
  servicioSeleccionado: "",
});

export const crearClaveBorradorCotizacion = (identificadorUsuario: string) =>
  `${BORRADOR_STORAGE_PREFIX}:${encodeURIComponent(identificadorUsuario.trim().toLowerCase())}`;

export const leerBorradorCotizacion = (
  identificadorUsuario: string
): EstadoBorradorCotizacion | null => {
  const storage = obtenerStorage();
  if (!storage || !identificadorUsuario.trim()) return null;

  const clave = crearClaveBorradorCotizacion(identificadorUsuario);

  try {
    const valorPersistido = storage.getItem(clave);
    if (!valorPersistido) return null;

    const borrador: unknown = JSON.parse(valorPersistido);
    if (!esBorradorPersistido(borrador)) {
      storage.removeItem(clave);
      return null;
    }

    return {
      datos: borrador.datos,
      ivaHabilitado: borrador.ivaHabilitado,
      ivaGuardado: borrador.ivaGuardado,
      servicioSeleccionado: borrador.servicioSeleccionado,
    };
  } catch {
    try {
      storage.removeItem(clave);
    } catch {
      // Browser storage can be unavailable even after obtaining the reference.
    }
    return null;
  }
};

export const guardarBorradorCotizacion = (
  identificadorUsuario: string,
  estado: EstadoBorradorCotizacion
) => {
  const storage = obtenerStorage();
  if (!storage || !identificadorUsuario.trim()) return false;

  const borrador: BorradorCotizacionPersistido = {
    version: BORRADOR_VERSION,
    actualizadoEn: Date.now(),
    ...estado,
  };

  try {
    storage.setItem(
      crearClaveBorradorCotizacion(identificadorUsuario),
      JSON.stringify(borrador)
    );
    return true;
  } catch {
    return false;
  }
};

export const eliminarBorradorCotizacion = (identificadorUsuario: string) => {
  const storage = obtenerStorage();
  if (!storage || !identificadorUsuario.trim()) return false;

  try {
    storage.removeItem(crearClaveBorradorCotizacion(identificadorUsuario));
    return true;
  } catch {
    return false;
  }
};

export const tieneContenidoBorrador = (estado: EstadoBorradorCotizacion) => {
  const { datos } = estado;

  return (
    datos.cliente.trim() !== "" ||
    datos.evento.trim() !== "" ||
    datos.lugar.trim() !== "" ||
    datos.notas.trim() !== "" ||
    datos.descuento !== 0 ||
    (datos.iva ?? 19) !== 19 ||
    datos.fecha !== "" ||
    datos.nombreEncargado !== "Carlos Jaramillo" ||
    datos.cargo !== "Director general" ||
    datos.productos.length > 0 ||
    !estado.ivaHabilitado ||
    estado.servicioSeleccionado !== ""
  );
};
