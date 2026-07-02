import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, User, Calendar } from "lucide-react";

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
        <p>Proyecto no encontrado</p>
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
        className="text-blue-600 hover:underline flex items-center gap-1 mb-4"
      >
        <ArrowLeft size={16} /> Volver al dashboard
      </Link>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
            <p className="text-gray-500">{proyecto.direccion_propiedad}</p>
            <form
              action={async () => {
                "use server";
                const { eliminarProyecto } = await import("@/lib/acciones");
                await eliminarProyecto(id);
              }}
              className="mt-2"
            >
              <button
                type="submit"
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Eliminar proyecto
              </button>
            </form>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAtrasado ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {isAtrasado ? "Atrasado" : "Al día"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <span className="text-xs text-gray-500">Fase</span>
            <p className="font-medium">{proyecto.fase_actual}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Tipo</span>
            <p className="font-medium">{proyecto.tipo_proyecto}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Dependencia</span>
            <p className="font-medium">{proyecto.dependencia}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Responsable</span>
            <p className="font-medium">{proyecto.responsable_interno || "—"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Pago</span>
            <p className="font-medium">{proyecto.estado_pago}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Permiso</span>
            <p className="font-medium">{proyecto.estado_permiso}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Inicio</span>
            <p className="font-medium">
              {new Date(proyecto.fecha_inicio).toLocaleDateString("es-ES")}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Próx. seguimiento</span>
            <p className="font-medium">
              {proyecto.fecha_proximo_seguimiento
                ? new Date(proyecto.fecha_proximo_seguimiento).toLocaleDateString("es-ES")
                : "—"}
            </p>
          </div>
        </div>

        {/* Cambiar fase */}
        <form
          action={async (formData: FormData) => {
            "use server";
            const { cambiarFase } = await import("@/lib/acciones");
            const faseNueva = formData.get("fase") as string;
            await cambiarFase(id, faseNueva);
          }}
          className="mt-6 p-4 bg-blue-50 rounded-lg"
        >
          <label className="text-sm font-medium text-blue-800">Cambiar fase:</label>
          <div className="flex gap-2 mt-1">
            <select
              name="fase"
              defaultValue={proyecto.fase_actual}
              className="border rounded px-2 py-1 text-sm flex-1"
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
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
            >
              Cambiar
            </button>
          </div>
        </form>

        {proyecto.notas_internas && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-1">Notas internas</h3>
            <p className="text-sm">{proyecto.notas_internas}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Pendientes</h2>
        {pendientes && pendientes.length > 0 ? (
          <div className="space-y-2">
            {pendientes.map((pendiente) => (
              <div
                key={pendiente.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  pendiente.estado === "Completado"
                    ? "bg-gray-50 border-gray-200"
                    : pendiente.estado === "Pendiente" && new Date(pendiente.fecha_limite) < new Date()
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {pendiente.estado === "Completado" ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : new Date(pendiente.fecha_limite) < new Date() ? (
                    <AlertCircle size={18} className="text-red-500" />
                  ) : (
                    <Clock size={18} className="text-orange-400" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{pendiente.descripcion}</p>
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
                {pendiente.estado === "Completado" ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Completado
                  </span>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      const { completarPendiente } = await import("@/lib/acciones");
                      await completarPendiente(pendiente.id, id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <button
                      type="submit"
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                      Marcar completado
                    </button>
                    <span className="text-xs text-gray-400">|</span>
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
                      className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200"
                    >
                      Enviar recordatorio
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay pendientes para este proyecto.</p>
        )}
      </div>
    </main>
  );
}