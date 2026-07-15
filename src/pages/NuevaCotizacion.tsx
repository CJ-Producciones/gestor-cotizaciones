import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Download,
  Save,
  Loader2,
  RotateCcw,
  FileText,
  Package,
  ChevronsUpDown,
  Search,
  Check,
} from "lucide-react";
import VistaPrevia from "@/components/VistaPrevia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DatosCotizacion, Producto, ProductoServicio, Servicio } from "@/types/cotizacion";
import { PlantillasService } from "@/services/plantillasService";
import { crearCotizacion } from "@/services/cotizacionesService";
import { obtenerServicios } from "@/services/serviciosService";
import { obtenerProductos } from "@/services/productosService";
import { WordExportService } from "@/services/wordExportService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const normalizarTexto = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const NuevaCotizacion = () => {
  const location = useLocation();
  const { user } = useAuth();
  const plantillaData = location.state?.plantilla as DatosCotizacion | undefined;
  const cotizacionData = location.state?.cotizacion as DatosCotizacion | undefined;
  const vistaPreviaRef = useRef<HTMLDivElement>(null);

  const [datos, setDatos] = useState<DatosCotizacion>({
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

  const [ivaHabilitado, setIvaHabilitado] = useState(true);
  const ivaGuardadoRef = useRef<number>(19);

  useEffect(() => {
    const dataBase = cotizacionData ?? plantillaData;
    if (!dataBase) return;

    const productos = dataBase.productos.map((p, index) => {
      const productoId =
        typeof p.productoId === "number"
          ? p.productoId
          : Number.isFinite(Number(p.id))
            ? Number(p.id)
            : null;

      return {
        ...p,
        id: `${Date.now()}-${index}`,
        productoId,
        precioVariable: p.precioVariable ?? p.precioUnitario === 0,
      };
    });

    setDatos({ ...dataBase, productos });

    if (cotizacionData) {
      toast.success("Cotización cargada correctamente");
    } else {
      toast.success("Plantilla cargada correctamente");
    }
  }, []);

  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>("");
  const [buscadorServicioAbierto, setBuscadorServicioAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [dialogPlantillaAbierto, setDialogPlantillaAbierto] = useState(false);
  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [descripcionPlantilla, setDescripcionPlantilla] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [productosServicio, setProductosServicio] = useState<ProductoServicio[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [guardandoCotizacion, setGuardandoCotizacion] = useState(false);
  const [guardandoPlantilla, setGuardandoPlantilla] = useState(false);
  const [descargandoWord, setDescargandoWord] = useState(false);

  const handleInputChange = (field: keyof DatosCotizacion, value: string | number) => {
    setDatos((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleIva = useCallback(
    (habilitado: boolean) => {
      if (!habilitado) {
        ivaGuardadoRef.current = datos.iva ?? 19;
        setDatos((prev) => ({ ...prev, iva: 0 }));
      } else {
        setDatos((prev) => ({ ...prev, iva: ivaGuardadoRef.current }));
      }
      setIvaHabilitado(habilitado);
    },
    [datos.iva]
  );

  useEffect(() => {
    let activo = true;

    const cargarServicios = async () => {
      setCargandoServicios(true);
      try {
        const data = await obtenerServicios();
        if (!activo) return;
        setServicios(data);
      } catch (error) {
        if (!activo) return;
        console.error(error);
        toast.error("No se pudieron cargar los servicios");
      } finally {
        if (activo) setCargandoServicios(false);
      }
    };

    cargarServicios();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      if (!servicioSeleccionado) {
        setProductosServicio([]);
        return;
      }

      setCargandoProductos(true);
      try {
        const data = await obtenerProductos(Number(servicioSeleccionado));
        if (!activo) return;
        setProductosServicio(data);
      } catch (error) {
        if (!activo) return;
        console.error(error);
        toast.error("No se pudieron cargar los productos del servicio");
      } finally {
        if (activo) setCargandoProductos(false);
      }
    };

    cargarProductos();
    return () => { activo = false; };
  }, [servicioSeleccionado]);

  const handleAgregarProducto = (producto: ProductoServicio) => {
    const productoId = String(producto.id);
    const nombreServicio =
      servicios.find((s) => s.id === producto.id_servicio)?.nombre || "Servicio";

    setDatos((prev) => {
      if (prev.productos.some((item) => item.productoId === producto.id)) return prev;

      const nuevoProducto: Producto = {
        id: productoId,
        descripcion: producto.nombre || "Producto sin nombre",
        cantidad: 1,
        precioUnitario: producto.precio ?? 0,
        productoId: producto.id,
        servicioId: producto.id_servicio,
        nombreServicio,
        descripcionProducto: producto.descripcion ?? null,
        precioVariable: !producto.precio,
      };

      return { ...prev, productos: [...prev.productos, nuevoProducto] };
    });

    toast.success("Producto agregado");
  };

  const handleAgregarTodos = () => {
    if (productosServicio.length === 0) {
      toast.error("No hay productos disponibles para este servicio");
      return;
    }

    setDatos((prev) => {
      const existentes = new Set(prev.productos.map((item) => item.productoId).filter(Boolean));
      const nuevos = productosServicio
        .filter((p) => !existentes.has(p.id))
        .map((p) => ({
          id: String(p.id),
          descripcion: p.nombre || "Producto sin nombre",
          cantidad: 1,
          precioUnitario: p.precio ?? 0,
          productoId: p.id,
          servicioId: p.id_servicio,
          nombreServicio: servicios.find((s) => s.id === p.id_servicio)?.nombre || "Servicio",
          descripcionProducto: p.descripcion ?? null,
          precioVariable: !p.precio,
        }));

      if (nuevos.length === 0) return prev;
      return { ...prev, productos: [...prev.productos, ...nuevos] };
    });

    toast.success("Productos agregados");
  };

  const handleEliminarProducto = (id: string) => {
    setDatos((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
    }));
    toast.info("Producto eliminado");
  };

  const handleCantidadChange = (id: string, cantidad: number) => {
    setDatos((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      ),
    }));
  };

  const handlePrecioChange = (id: string, precio: number) => {
    setDatos((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.id === id ? { ...p, precioUnitario: precio } : p
      ),
    }));
  };

  const handleGuardarCotizacion = async () => {
    if (!datos.cliente) {
      toast.error("Ingresa el nombre del cliente");
      return;
    }
    if (datos.productos.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }
    try {
      setGuardandoCotizacion(true);
      await crearCotizacion(datos, datos.productos);
      toast.success("Cotización guardada exitosamente");
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo guardar la cotización";
      toast.error(mensaje);
    } finally {
      setGuardandoCotizacion(false);
    }
  };

  const handleAbrirDialogoPlantilla = () => {
    if (datos.productos.length === 0) {
      toast.error("Agrega al menos un producto antes de guardar como plantilla");
      return;
    }
    setDialogPlantillaAbierto(true);
  };

  const handleGuardarComoPlantilla = async () => {
    if (!nombrePlantilla.trim()) {
      toast.error("Ingresa un nombre para la plantilla");
      return;
    }

    try {
      setGuardandoPlantilla(true);
      await PlantillasService.crear(
        nombrePlantilla,
        descripcionPlantilla,
        datos,
        user?.name || "Usuario",
        "FileText",
        "bg-blue-500"
      );
      toast.success("Plantilla guardada exitosamente");
      setDialogPlantillaAbierto(false);
      setNombrePlantilla("");
      setDescripcionPlantilla("");
    } catch (error) {
      toast.error("Error al guardar la plantilla");
      console.error(error);
    } finally {
      setGuardandoPlantilla(false);
    }
  };

  const handleDescargarWord = async () => {
    setDescargandoWord(true);
    try {
      await WordExportService.generarDocumento(datos);
      toast.success("Documento Word descargado correctamente");
    } catch (error) {
      toast.error("Error al generar el documento Word");
      console.error(error);
    } finally {
      setDescargandoWord(false);
    }
  };

  const handleLimpiarDatos = () => {
    setDatos({
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
    setIvaHabilitado(true);
    ivaGuardadoRef.current = 19;
    setServicioSeleccionado("");
    setProductosServicio([]);
    toast.success("Datos limpiados correctamente");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Nueva Cotización
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completá los datos y agregá productos para generar la cotización
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLimpiarDatos}
          className="shrink-0 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left column: forms ────────────────────────────────── */}
        <div className="space-y-5">

          {/* ── Info panel ────────────────────────────────────────── */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="h-0.5 w-full bg-primary" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-foreground">Información de la cotización</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Cliente / Empresa</label>
                  <Input
                    className="h-9"
                    placeholder="Nombre completo o razón social"
                    value={datos.cliente}
                    onChange={(e) => handleInputChange("cliente", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Evento</label>
                  <Input
                    className="h-9"
                    placeholder="Nombre del evento"
                    value={datos.evento}
                    onChange={(e) => handleInputChange("evento", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Lugar de evento</label>
                <Input
                  className="h-9"
                  placeholder="Lugar donde se realizará el evento"
                  value={datos.lugar}
                  onChange={(e) => handleInputChange("lugar", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Notas <span className="text-muted-foreground/60">(una por línea)</span>
                </label>
                <Textarea
                  className="resize-none text-sm"
                  placeholder="Ingresa las notas del servicio…"
                  value={datos.notas}
                  onChange={(e) => handleInputChange("notas", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Descuento */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Descuento (%)</label>
                  <Input
                    type="number"
                    className="h-9"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={datos.descuento || ""}
                    onChange={(e) => handleInputChange("descuento", Number(e.target.value))}
                  />
                </div>

                {/* IVA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between h-4">
                    <label className="text-xs text-muted-foreground">IVA (%)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {ivaHabilitado ? "On" : "Off"}
                      </span>
                      <Switch
                        checked={ivaHabilitado}
                        onCheckedChange={handleToggleIva}
                        className="scale-75 origin-right"
                      />
                    </div>
                  </div>
                  <Input
                    type="number"
                    className={`h-9 ${!ivaHabilitado ? "opacity-40 cursor-not-allowed" : ""}`}
                    placeholder="19"
                    min="0"
                    max="100"
                    disabled={!ivaHabilitado}
                    value={ivaHabilitado ? (datos.iva ?? 19) : ""}
                    onChange={(e) => handleInputChange("iva", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Fecha</label>
                  <Input
                    type="date"
                    className="h-9"
                    value={datos.fecha}
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Encargado</label>
                  <Input
                    className="h-9"
                    placeholder="Carlos Jaramillo"
                    value={datos.nombreEncargado}
                    onChange={(e) => handleInputChange("nombreEncargado", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Cargo</label>
                  <Input
                    className="h-9"
                    placeholder="Director general"
                    value={datos.cargo}
                    onChange={(e) => handleInputChange("cargo", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Products panel ────────────────────────────────────── */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="h-0.5 w-full bg-primary" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-foreground">Servicios y productos</p>
              </div>

              {/* Service selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Servicio</label>
                <Popover open={buscadorServicioAbierto} onOpenChange={setBuscadorServicioAbierto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={buscadorServicioAbierto}
                      className={`h-9 w-full justify-between font-normal ${
                        servicioSeleccionado ? "text-foreground" : "text-muted-foreground"
                      }`}
                      disabled={cargandoServicios}
                    >
                      <span className="inline-flex items-center gap-2 min-w-0">
                        {cargandoServicios ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Search className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="truncate">
                          {cargandoServicios
                            ? "Cargando servicios…"
                            : servicios.find((s) => String(s.id) === servicioSeleccionado)
                                ?.nombre || "Buscar un servicio…"}
                        </span>
                      </span>
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command
                      filter={(value, search) =>
                        normalizarTexto(value).includes(normalizarTexto(search)) ? 1 : 0
                      }
                    >
                      <CommandInput placeholder="Buscar por palabras clave…" />
                      <CommandList>
                        <CommandEmpty>
                          {servicios.length === 0
                            ? "No hay servicios disponibles"
                            : "No se encontraron servicios"}
                        </CommandEmpty>
                        <CommandGroup>
                          {servicios.map((s) => (
                            <CommandItem
                              key={s.id}
                              value={`${s.nombre || "Servicio sin nombre"} ${s.id}`}
                              onSelect={() => {
                                setServicioSeleccionado(String(s.id));
                                setBuscadorServicioAbierto(false);
                              }}
                              className="gap-2 py-2.5"
                            >
                              <Check
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  String(s.id) === servicioSeleccionado
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              <span className="text-sm font-medium text-foreground truncate">
                                {s.nombre || "Servicio sin nombre"}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Product search combobox */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">Productos disponibles</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleAgregarTodos}
                    disabled={cargandoProductos || productosServicio.length === 0}
                  >
                    <Plus className="h-3 w-3" />
                    Agregar todos
                  </Button>
                </div>
                <Popover open={buscadorAbierto} onOpenChange={setBuscadorAbierto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={buscadorAbierto}
                      className="h-9 w-full justify-between font-normal text-muted-foreground"
                      disabled={!servicioSeleccionado || cargandoProductos}
                    >
                      <span className="inline-flex items-center gap-2">
                        {cargandoProductos ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Search className="h-3.5 w-3.5" />
                        )}
                        {cargandoProductos
                          ? "Cargando productos…"
                          : servicioSeleccionado
                            ? "Buscar y agregar producto…"
                            : "Seleccioná un servicio primero"}
                      </span>
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command
                      filter={(value, search) =>
                        normalizarTexto(value).includes(normalizarTexto(search)) ? 1 : 0
                      }
                    >
                      <CommandInput placeholder="Buscar por palabras clave…" />
                      <CommandList>
                        <CommandEmpty>
                          {productosServicio.length === 0
                            ? "Este servicio no tiene productos"
                            : "No se encontraron productos"}
                        </CommandEmpty>
                        <CommandGroup>
                          {productosServicio.map((producto) => {
                            const yaAgregado = datos.productos.some(
                              (p) => p.productoId === producto.id
                            );
                            return (
                              <CommandItem
                                key={producto.id}
                                value={`${producto.nombre || "Producto sin nombre"} ${producto.id}`}
                                disabled={yaAgregado}
                                onSelect={() => {
                                  handleAgregarProducto(producto);
                                  setBuscadorAbierto(false);
                                }}
                                className="justify-between gap-3 py-2.5"
                              >
                                <span className="min-w-0">
                                  <span className="text-sm font-medium text-foreground block truncate">
                                    {producto.nombre || "Producto sin nombre"}
                                  </span>
                                  {producto.descripcion && (
                                    <span className="text-xs text-muted-foreground block truncate">
                                      {producto.descripcion}
                                    </span>
                                  )}
                                </span>
                                <span className="text-sm tabular-nums font-medium text-foreground whitespace-nowrap">
                                  {formatCurrency(producto.precio ?? 0)}
                                </span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Added products table */}
            </div>
          </div>
        </div>

        {/* ── Right column: preview + actions ───────────────────── */}
        <div className="space-y-4">
          <VistaPrevia
            ref={vistaPreviaRef}
            datos={datos}
            onPrecioChange={handlePrecioChange}
            onCantidadChange={handleCantidadChange}
            onEliminarProducto={handleEliminarProducto}
          />

          {/* Action buttons */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleDescargarWord}
                disabled={descargandoWord}
                className="flex-1 gap-2"
              >
                {descargandoWord ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {descargandoWord ? "Generando…" : "Descargar Word"}
              </Button>
              <Button
                variant="outline"
                onClick={handleAbrirDialogoPlantilla}
                disabled={guardandoPlantilla}
                className="flex-1 gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar Plantilla
              </Button>
              <Button
                onClick={handleGuardarCotizacion}
                disabled={guardandoCotizacion}
                className="flex-1 gap-2"
              >
                {guardandoCotizacion ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {guardandoCotizacion ? "Guardando…" : "Guardar Cotización"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Save as template dialog ───────────────────────────────── */}
      <Dialog open={dialogPlantillaAbierto} onOpenChange={setDialogPlantillaAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar como Plantilla</DialogTitle>
            <DialogDescription>
              Guardá esta configuración como plantilla para reutilizarla en futuras cotizaciones.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-plantilla">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre-plantilla"
                placeholder="Ej: Evento Corporativo Estándar"
                value={nombrePlantilla}
                onChange={(e) => setNombrePlantilla(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion-plantilla">Descripción (opcional)</Label>
              <Textarea
                id="descripcion-plantilla"
                placeholder="Breve descripción de la plantilla…"
                value={descripcionPlantilla}
                onChange={(e) => setDescripcionPlantilla(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogPlantillaAbierto(false)}
              disabled={guardandoPlantilla}
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardarComoPlantilla} disabled={guardandoPlantilla}>
              {guardandoPlantilla ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Guardar Plantilla"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NuevaCotizacion;
