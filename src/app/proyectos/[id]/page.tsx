import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, User, Calendar, Edit3 } from "lucide-react";

export default async function ProyectoDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: proyecto } = await supabase
    .from("proyectos")
    .select("*, cliente:clientes(email)")
    .eq("id", id)
    .single();

  const { data: pendientes } = await supabase
    .from("pendientes")
    .select("*")
    .eq("proyecto_id", id)
    .order("fecha_limite", { ascending: true });

  if (!proyecto) {
    return (
      <main className="p-8">
        <p className="text-gray-600">Proyecto no encontrado</p>
        <Link href="/" className="text-blue-600 underline">
          Volver al dashboard
        </Link>
      </main>
    );
  }

  const isAtrasado =
    proyecto.fecha_proximo_seguimiento &&
    new Date(proyecto.fecha_proximo_seguimiento) < new Date();

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6 font-medium"
      >
        <ArrowLeft size={16} /> Volver al dashboard
      </Link>

      {/* Encabezado del proyecto */}
      <div className={`rounded-2xl shadow-lg p-6 mb-6 ${isAtrasado ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-600 to-blue-700"}`}>
        <div className="flex justify-between items-start">
          <div className="text-white">
            <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
            <p className="text-white/80 text-sm mt-1">{proyecto.direccion_propiedad}</p>
            <form
              action={async () => {
                "use server";
                const { eliminarProyecto } = await import("@/lib/acciones");
                await eliminarProyecto(id);
              }}
              className="mt-3"
            >
              <button
                type="submit"
                className="text-xs text-white/60 hover:text-white underline"
              >
                Eliminar proyecto
              </button>
            </form>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow ${isAtrasado ? "bg-white text-red-600" : "bg-white text-blue-600"}`}>
            {isAtrasado ? "⚠ Atrasado" : "✓ Al día"}
          </span>
        </div>

        {/* Datos rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Fase", value: proyecto.fase_actual },
            { label: "Tipo", value: proyecto.tipo_proyecto },
            { label: "Dependencia", value: proyecto.dependencia },
            { label: "Responsable", value: proyecto.responsable_interno || "—" },
            { label: "Pago", value: proyecto.estado_pago },
            { label: "Permiso", value: proyecto.estado_permiso },
            { label: "Inicio", value: new Date(proyecto.fecha_inicio).toLocaleDateString("es-ES") },
            { label: "Próx. seguimiento", value: proyecto.fecha_proximo_seguimiento ? new Date(proyecto.fecha_proximo_seguimiento).toLocaleDateString("es-ES") : "—" },
          ].map((item) => (
            <div key={item.label} className="bg-white/15 backdrop-blur rounded-lg p-2.5">
              <span className="text-white/60 text-xs">{item.label}</span>
              <p className="text-white font-medium text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Cambiar fase + Editar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cambiar fase */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const { cambiarFase } = await import("@/lib/acciones");
              const faseNueva = formData.get("fase") as string;
              await cambiarFase(id, faseNueva);
            }}
            className="bg-white rounded-xl shadow p-5"
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Edit3 size={14} /> Cambiar fase
            </label>
            <select
              name="fase"
              defaultValue={proyecto.fase_actual}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Cliente interesado">Cliente interesado</option>
              <option value="Propuesta enviada">Propuesta enviada</option>
              <option value="Esperando aprobación del cliente">Esperando aprobación del cliente</option>
              <option value="Pago recibido">Pago recibido</option>
              <option value="Información inicial recibida">Información inicial recibida</option>
              <option value="Layout en desarrollo">Layout en desarrollo</option>
              <option value="Layout enviado al cliente">Layout enviado al cliente</option>
              <option value="Esperando confirmación del cliente">Esperando confirmación del cliente</option>
              <option value="Planos completos en desarrollo">Planos completos en desarrollo</option>
              <option value="Cálculo de energía pendiente">Cálculo de energía pendiente</option>
              <option value="Firma del cliente pendiente">Firma del cliente pendiente</option>
              <option value="Ingeniería pendiente">Ingeniería pendiente</option>
              <option value="Listo para someter permiso">Listo para someter permiso</option>
              <option value="Permiso sometido">Permiso sometido</option>
              <option value="Comentarios de la ciudad recibidos">Comentarios de la ciudad recibidos</option>
              <option value="Revisiones en proceso">Revisiones en proceso</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Cerrado">Cerrado</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 w-full transition"
            >
              Cambiar fase
            </button>
          </form>

          {/* Editar proyecto */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const { actualizarProyecto } = await import("@/lib/acciones");
              await actualizarProyecto(id, formData);
            }}
            className="bg-white rounded-xl shadow p-5"
          >
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Edit3 size={14} /> Editar proyecto
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Próx. seguimiento</label>
                <input
                  type="date"
                  name="fecha_proximo_seguimiento"
                  defaultValue={proyecto.fecha_proximo_seguimiento || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Responsable</label>
                <input
                  type="text"
                  name="responsable_interno"
                  defaultValue={proyecto.responsable_interno || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Dependencia</label>
                <select
                  name="dependencia"
                  defaultValue={proyecto.dependencia || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Depende del cliente">Depende del cliente</option>
                  <option value="Depende de PlanGuard">Depende de PlanGuard</option>
                  <option value="Depende de la ciudad">Depende de la ciudad</option>
                  <option value="En espera">En espera</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Tipo de proyecto</label>
                <select
                  name="tipo_proyecto"
                  defaultValue={proyecto.tipo_proyecto || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planos de remodelación">Planos de remodelación</option>
                  <option value="Remodelación residencial">Remodelación residencial</option>
                  <option value="Permiso comercial">Permiso comercial</option>
                  <option value="Diseño">Diseño</option>
                  <option value="Revisión">Revisión</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Estado de pago</label>
                <select
                  name="estado_pago"
                  defaultValue={proyecto.estado_pago || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Completo">Completo</option>
                  <option value="Reembolso">Reembolso</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Estado del permiso</label>
                <select
                  name="estado_permiso"
                  defaultValue={proyecto.estado_permiso || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="No aplica">No aplica</option>
                  <option value="Por someter">Por someter</option>
                  <option value="Sometido">Sometido</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                  <option value="Comentarios">Comentarios</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Link documentos</label>
                <input
                  type="url"
                  name="link_documentos"
                  defaultValue={proyecto.link_documentos || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Notas internas</label>
                <textarea
                  name="notas_internas"
                  defaultValue={proyecto.notas_internas || ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-3 bg-slate-700 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-slate-800 w-full transition"
            >
              Guardar cambios
            </button>
          </form>
        </div>

        {/* Columna derecha: Pendientes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-orange-500" /> Pendientes
            </h2>

            {/* Crear pendiente */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const { crearPendiente } = await import("@/lib/acciones");
                await crearPendiente(id, formData);
              }}
              className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  name="descripcion"
                  placeholder="¿Qué hay pendiente?"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 md:col-span-2"
                />
                <select
                  name="responsable"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Responsable</option>
                  <option value="Cliente">Cliente</option>
                  <option value="PlanGuard">PlanGuard</option>
                  <option value="Ciudad">Ciudad</option>
                  <option value="Tercero">Tercero</option>
                </select>
                <input
                  type="date"
                  name="fecha_limite"
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <input type="hidden" name="tipo" value="Tarea interna" />
              <button
                type="submit"
                className="mt-2 bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-orange-600 transition"
              >
                + Agregar pendiente
              </button>
            </form>

            {pendientes && pendientes.length > 0 ? (
              <div className="space-y-2">
                {pendientes.map((pendiente) => (
                  <div
                    key={pendiente.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                      pendiente.estado === "Completado"
                        ? "bg-gray-50 border-gray-200"
                        : pendiente.estado === "Pendiente" && new Date(pendiente.fecha_limite) < new Date()
                        ? "bg-red-50 border-red-300"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {pendiente.estado === "Completado" ? (
                        <div className="bg-green-100 p-1.5 rounded-full">
                          <CheckCircle size={18} className="text-green-600" />
                        </div>
                      ) : new Date(pendiente.fecha_limite) < new Date() ? (
                        <div className="bg-red-100 p-1.5 rounded-full">
                          <AlertCircle size={18} className="text-red-600" />
                        </div>
                      ) : (
                        <div className="bg-orange-100 p-1.5 rounded-full">
                          <Clock size={18} className="text-orange-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-gray-800">{pendiente.descripcion}</p>
                        <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <User size={12} /> {pendiente.responsable}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />{" "}
                            {new Date(pendiente.fecha_limite).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        const { alternarPendiente } = await import("@/lib/acciones");
                        await alternarPendiente(pendiente.id, id, pendiente.estado);
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1 rounded-full border transition ${
                          pendiente.estado === "Completado"
                            ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        }`}
                      >
                        {pendiente.estado === "Completado" ? "Reabrir" : "Completar"}
                      </button>
                      {pendiente.estado !== "Completado" && (
                        <button
                          formAction={async () => {
                            "use server";
                            const emailCliente = proyecto?.cliente?.email;
                            if (!emailCliente) return;
                            const { enviarRecordatorioPendiente } = await import("@/lib/acciones");
                            await enviarRecordatorioPendiente(
                              pendiente.id,
                              id,
                              emailCliente,
                              proyecto.nombre,
                              pendiente.descripcion
                            );
                          }}
                          className="text-xs px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition"
                        >
                          Recordatorio
                        </button>
                      )}
                      <button
                        formAction={async () => {
                          "use server";
                          const { eliminarPendiente } = await import("@/lib/acciones");
                          await eliminarPendiente(pendiente.id, id);
                        }}
                        className="text-xs px-2 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition"
                        title="Eliminar pendiente"
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay pendientes para este proyecto.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}