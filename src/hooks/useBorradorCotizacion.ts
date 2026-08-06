import { useEffect, useRef, useState } from "react";
import type { DatosCotizacion, Producto } from "@/types/cotizacion";
import {
  crearEstadoBorradorVacio,
  eliminarBorradorCotizacion,
  guardarBorradorCotizacion,
  leerBorradorCotizacion,
  tieneContenidoBorrador,
  type EstadoBorradorCotizacion,
} from "@/utils/borradorCotizacion";

export const ORIGEN_DATOS_COTIZACION = {
  COTIZACION: "cotizacion",
  PLANTILLA: "plantilla",
} as const;

export const RESULTADO_DESCARTE_BORRADOR = {
  DESCARTADO: "descartado",
  ERROR: "error",
  MODIFICADO: "modificado",
} as const;

export type OrigenDatosCotizacion =
  (typeof ORIGEN_DATOS_COTIZACION)[keyof typeof ORIGEN_DATOS_COTIZACION];

export interface DatosCotizacionEntrantes {
  datos: DatosCotizacion;
  origen: OrigenDatosCotizacion;
}

interface UseBorradorCotizacionParams {
  identificadorUsuario?: string;
  datosEntrantes: DatosCotizacionEntrantes | null;
}

interface EstadoInicialBorrador extends EstadoBorradorCotizacion {
  reemplazoPendiente: DatosCotizacionEntrantes | null;
  origenAplicado: OrigenDatosCotizacion | null;
}

const normalizarProductosEntrantes = (productos: Producto[]) => {
  const marcaTiempo = Date.now();

  return productos.map((producto, indice) => {
    const productoId =
      typeof producto.productoId === "number"
        ? producto.productoId
        : Number.isFinite(Number(producto.id))
          ? Number(producto.id)
          : null;

    return {
      ...producto,
      id: `${marcaTiempo}-${indice}`,
      productoId,
    };
  });
};

const crearEstadoDesdeDatosEntrantes = (
  datosEntrantes: DatosCotizacionEntrantes
): EstadoBorradorCotizacion => {
  const iva = datosEntrantes.datos.iva ?? 19;
  const ivaHabilitado = iva > 0;

  return {
    datos: {
      ...datosEntrantes.datos,
      iva,
      productos: normalizarProductosEntrantes(datosEntrantes.datos.productos),
    },
    ivaHabilitado,
    ivaGuardado: ivaHabilitado ? iva : 19,
    servicioSeleccionado: "",
  };
};

const crearEstadoInicial = ({
  identificadorUsuario,
  datosEntrantes,
}: UseBorradorCotizacionParams): EstadoInicialBorrador => {
  const borradorGuardado = identificadorUsuario
    ? leerBorradorCotizacion(identificadorUsuario)
    : null;
  const estadoBase = borradorGuardado ?? crearEstadoBorradorVacio();

  if (!datosEntrantes) {
    return {
      ...estadoBase,
      reemplazoPendiente: null,
      origenAplicado: null,
    };
  }

  if (borradorGuardado && tieneContenidoBorrador(borradorGuardado)) {
    return {
      ...borradorGuardado,
      reemplazoPendiente: datosEntrantes,
      origenAplicado: null,
    };
  }

  return {
    ...crearEstadoDesdeDatosEntrantes(datosEntrantes),
    reemplazoPendiente: null,
    origenAplicado: datosEntrantes.origen,
  };
};

export const useBorradorCotizacion = ({
  identificadorUsuario,
  datosEntrantes,
}: UseBorradorCotizacionParams) => {
  const estadoInicialRef = useRef<EstadoInicialBorrador | null>(null);

  if (!estadoInicialRef.current) {
    estadoInicialRef.current = crearEstadoInicial({
      identificadorUsuario,
      datosEntrantes,
    });
  }

  const estadoInicial = estadoInicialRef.current;
  const [datos, setDatos] = useState(estadoInicial.datos);
  const [ivaHabilitado, setIvaHabilitado] = useState(estadoInicial.ivaHabilitado);
  const [ivaGuardado, setIvaGuardado] = useState(estadoInicial.ivaGuardado);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(
    estadoInicial.servicioSeleccionado
  );
  const [reemplazoPendiente, setReemplazoPendiente] = useState(
    estadoInicial.reemplazoPendiente
  );
  const [origenAplicado, setOrigenAplicado] = useState<OrigenDatosCotizacion | null>(
    estadoInicial.origenAplicado
  );
  const [identificadorHidratado, setIdentificadorHidratado] = useState(
    identificadorUsuario
  );
  const [errorPersistencia, setErrorPersistencia] = useState(false);

  useEffect(() => {
    if (identificadorUsuario === identificadorHidratado) return;

    const nuevoEstado = crearEstadoInicial({
      identificadorUsuario,
      datosEntrantes,
    });
    setDatos(nuevoEstado.datos);
    setIvaHabilitado(nuevoEstado.ivaHabilitado);
    setIvaGuardado(nuevoEstado.ivaGuardado);
    setServicioSeleccionado(nuevoEstado.servicioSeleccionado);
    setReemplazoPendiente(nuevoEstado.reemplazoPendiente);
    setOrigenAplicado(nuevoEstado.origenAplicado);
    setIdentificadorHidratado(identificadorUsuario);
    setErrorPersistencia(false);
  }, [datosEntrantes, identificadorHidratado, identificadorUsuario]);

  useEffect(() => {
    if (!identificadorUsuario || identificadorUsuario !== identificadorHidratado) return;

    const estado = {
      datos,
      ivaHabilitado,
      ivaGuardado,
      servicioSeleccionado,
    };

    if (tieneContenidoBorrador(estado)) {
      setErrorPersistencia(!guardarBorradorCotizacion(identificadorUsuario, estado));
    } else {
      setErrorPersistencia(!eliminarBorradorCotizacion(identificadorUsuario));
    }
  }, [
    datos,
    identificadorHidratado,
    identificadorUsuario,
    ivaGuardado,
    ivaHabilitado,
    servicioSeleccionado,
  ]);

  const snapshotBorrador = JSON.stringify({
    datos,
    ivaHabilitado,
    ivaGuardado,
    servicioSeleccionado,
  });
  const snapshotBorradorRef = useRef(snapshotBorrador);
  snapshotBorradorRef.current = snapshotBorrador;
  const cambiandoUsuario = identificadorUsuario !== identificadorHidratado;

  const conservarBorrador = () => {
    setReemplazoPendiente(null);
  };

  const reemplazarBorrador = () => {
    if (!reemplazoPendiente) return;

    const nuevoEstado = crearEstadoDesdeDatosEntrantes(reemplazoPendiente);
    setDatos(nuevoEstado.datos);
    setIvaHabilitado(nuevoEstado.ivaHabilitado);
    setIvaGuardado(nuevoEstado.ivaGuardado);
    setServicioSeleccionado(nuevoEstado.servicioSeleccionado);
    setOrigenAplicado(reemplazoPendiente.origen);
    setReemplazoPendiente(null);
  };

  const limpiarBorrador = () => {
    const estadoVacio = crearEstadoBorradorVacio();
    setDatos(estadoVacio.datos);
    setIvaHabilitado(estadoVacio.ivaHabilitado);
    setIvaGuardado(estadoVacio.ivaGuardado);
    setServicioSeleccionado(estadoVacio.servicioSeleccionado);
    setReemplazoPendiente(null);

    return identificadorUsuario
      ? eliminarBorradorCotizacion(identificadorUsuario)
      : true;
  };

  const obtenerSnapshotBorrador = () => snapshotBorradorRef.current;

  const descartarBorradorPersistido = (snapshotEsperado: string) => {
    if (snapshotBorradorRef.current !== snapshotEsperado) {
      return RESULTADO_DESCARTE_BORRADOR.MODIFICADO;
    }
    if (!identificadorUsuario) return RESULTADO_DESCARTE_BORRADOR.DESCARTADO;

    return eliminarBorradorCotizacion(identificadorUsuario)
      ? RESULTADO_DESCARTE_BORRADOR.DESCARTADO
      : RESULTADO_DESCARTE_BORRADOR.ERROR;
  };

  return {
    datos,
    setDatos,
    ivaHabilitado,
    setIvaHabilitado,
    ivaGuardado,
    setIvaGuardado,
    servicioSeleccionado,
    setServicioSeleccionado,
    reemplazoPendiente,
    origenAplicado,
    errorPersistencia,
    cambiandoUsuario,
    setOrigenAplicado,
    conservarBorrador,
    reemplazarBorrador,
    limpiarBorrador,
    obtenerSnapshotBorrador,
    descartarBorradorPersistido,
  };
};
