import { forwardRef } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { DatosCotizacion } from "@/types/cotizacion";
import logoCJ from "@/assets/LogoCJ.png";
import {
  DESPLAZAMIENTO_SERVICIO,
  agruparProductosPorServicio,
  type DesplazamientoServicio,
} from "@/utils/ordenCotizacion";

interface VistaPreviaProps {
  datos: DatosCotizacion;
  onPrecioChange?: (productoId: string, nuevoPrecio: number) => void;
  onCantidadChange?: (productoId: string, nuevaCantidad: number) => void;
  onEliminarProducto?: (productoId: string) => void;
  onMoverServicio?: (claveServicio: string, desplazamiento: DesplazamientoServicio) => void;
}

const VistaPrevia = forwardRef<HTMLDivElement, VistaPreviaProps>(
  (
    {
      datos,
      onPrecioChange,
      onCantidadChange,
      onEliminarProducto,
      onMoverServicio,
    },
    ref
  ) => {
  const subtotal = datos.productos.reduce(
    (acc, p) => acc + p.cantidad * p.precioUnitario,
    0
  );
  const descuentoMonto = subtotal * (datos.descuento / 100);
  const subtotalConDescuento = subtotal - descuentoMonto;
  const ivaPorcentaje = datos.iva ?? 19;
  const iva = subtotalConDescuento * (ivaPorcentaje / 100);
  const total = subtotalConDescuento + iva;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const gruposServicios = agruparProductosPorServicio(datos.productos);

  return (
    <div ref={ref} className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="font-semibold text-foreground mb-4">Vista Previa de Cotización</h3>

      <div className="bg-card border border-border rounded-lg p-6 text-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-border">
          <div className="flex items-center">
            <img src={logoCJ} alt="CJ Producciones" className="h-14" />
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-foreground">COTIZACIÓN</h2>
            <p className="text-muted-foreground text-xs">Fecha: {datos.fecha ? datos.fecha.split("-").reverse().join("/") : formatDate(today)}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="mb-6 text-xs text-muted-foreground">
          <p>Medellín, Colombia</p>
          <p>info@cjproducciones.com.co</p>
          <p>+57 315 494 3646</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Client Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Cliente</h4>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{datos.cliente || "Nombre del cliente"}</p>
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Evento</h4>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{datos.evento || "Nombre del evento"}</p>
              {datos.lugar && <p>{datos.lugar}</p>}
            </div>
          </div>
        </div>
        <div className="border-b border-border mb-6" />

        {/* Detail Tables by Service */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Detalles de los servicios y productos</h4>

          {datos.productos.length === 0 ? (
            <div className="border border-border rounded p-4 text-center text-muted-foreground text-xs">
              Agrega productos para ver el detalle
            </div>
          ) : (
            <div className="space-y-4">
              {gruposServicios.map((grupo, indice) => (
                <div key={grupo.clave} className="border border-border rounded overflow-hidden">
                  {/* Service Header */}
                  <div className="flex min-h-9 items-center justify-between gap-3 border-b border-border bg-primary/10 px-3 py-1.5">
                    <h5 className="min-w-0 truncate text-xs font-semibold text-foreground">
                      {grupo.nombre}
                    </h5>
                    {onMoverServicio && gruposServicios.length > 1 && (
                      <div className="flex shrink-0 items-center gap-1 print:hidden">
                        <span className="mr-0.5 text-[10px] font-medium text-muted-foreground">
                          Orden
                        </span>
                        <button
                          type="button"
                          aria-label={`Subir ${grupo.nombre}`}
                          title={`Subir ${grupo.nombre}`}
                          disabled={indice === 0}
                          onClick={() =>
                            onMoverServicio(
                              grupo.clave,
                              DESPLAZAMIENTO_SERVICIO.ARRIBA
                            )
                          }
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Bajar ${grupo.nombre}`}
                          title={`Bajar ${grupo.nombre}`}
                          disabled={indice === gruposServicios.length - 1}
                          onClick={() =>
                            onMoverServicio(
                              grupo.clave,
                              DESPLAZAMIENTO_SERVICIO.ABAJO
                            )
                          }
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[300px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 font-medium">Producto</th>
                        <th className="text-center p-2 font-medium w-12">Cant.</th>
                        <th className="text-right p-2 font-medium w-20">Precio</th>
                        <th className="text-right p-2 font-medium w-24">Total</th>
                        {onEliminarProducto && <th className="p-2 w-8" aria-label="Eliminar" />}
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.productos.map((producto) => {
                        return (
                          <tr key={producto.id} className="border-t border-border">
                            <td className="p-2">{producto.descripcion}</td>
                            <td className="p-2 text-center">
                              {onCantidadChange ? (
                                <input
                                  type="number"
                                  min="1"
                                  value={producto.cantidad}
                                  onChange={(e) =>
                                    onCantidadChange(producto.id, Math.max(1, Number(e.target.value)))
                                  }
                                  className="w-12 rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 text-center text-xs tabular-nums text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                              ) : (
                                producto.cantidad
                              )}
                            </td>
                            <td className="p-2 text-right">
                              {onPrecioChange ? (
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Precio de ${producto.descripcion}`}
                                  value={producto.precioUnitario}
                                  placeholder="0"
                                  onChange={(e) =>
                                    onPrecioChange(producto.id, Math.max(0, Number(e.target.value)))
                                  }
                                  className="w-20 rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 text-right text-xs tabular-nums text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                              ) : (
                                formatCurrency(producto.precioUnitario)
                              )}
                            </td>
                            <td className="p-2 text-right">
                              {formatCurrency(producto.cantidad * producto.precioUnitario)}
                            </td>
                            {onEliminarProducto && (
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  aria-label={`Eliminar ${producto.descripcion}`}
                                  onClick={() => onEliminarProducto(producto.id)}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-full sm:w-48 space-y-1 text-xs">
            {(ivaPorcentaje > 0 || datos.descuento > 0) && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            )}
            {datos.descuento > 0 && (
              <div className="flex justify-between text-success">
                <span>Descuento ({datos.descuento}%):</span>
                <span>-{formatCurrency(descuentoMonto)}</span>
              </div>
            )}
            {ivaPorcentaje > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA ({ivaPorcentaje}%):</span>
                <span>{formatCurrency(iva)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notas */}
        {datos.notas && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-2">Notas</h4>
            <div className="text-xs text-muted-foreground whitespace-pre-line">
              {datos.notas}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="text-xs">
            <p className="font-medium text-foreground">{datos.nombreEncargado || "Carlos Jaramillo"}</p>
            <p className="text-muted-foreground">{datos.cargo || "Director general"}</p>
            <p className="text-muted-foreground">carlos.jaramillo@cjproducciones.com</p>
          </div>
        </div>
      </div>
    </div>
  );
});

VistaPrevia.displayName = "VistaPrevia";

export default VistaPrevia;
