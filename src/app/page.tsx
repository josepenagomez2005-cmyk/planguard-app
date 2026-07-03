import { supabase } from "@/lib/supabase";
import Buscador from "@/components/Buscador";
import { AlertTriangle, Wrench, UserCheck, Building, CheckCircle, Layers } from "lucide-react";

export default async function Home() {
  const { data: proyectos } = await supabase
    .from("proyectos")
    .select("*, cliente:clientes(nombre)");

  const proyectosList = proyectos || [];

  const esperandoCliente = proyectosList.filter(
    (p) => p.dependencia === "Depende del cliente"
  );
  const enDesarrollo = proyectosList.filter(
    (p) => p.dependencia === "Depende de PlanGuard"
  );
  const atrasados = proyectosList.filter((p) => {
    if (!p.fecha_proximo_seguimiento) return false;
    return new Date(p.fecha_proximo_seguimiento) < new Date();
  });
  const sometidos = proyectosList.filter(
    (p) => p.fase_actual === "Permiso sometido"
  );
  const cerrados = proyectosList.filter(
    (p) => p.fase_actual === "Cerrado"
  );

  const stats = [
    { label: "Total", value: proyectosList.length, color: "bg-slate-600", icon: Layers },
    { label: "Atrasados", value: atrasados.length, color: "bg-red-500", icon: AlertTriangle },
    { label: "Esperando cliente", value: esperandoCliente.length, color: "bg-orange-500", icon: UserCheck },
    { label: "En desarrollo", value: enDesarrollo.length, color: "bg-purple-600", icon: Wrench },
    { label: "Sometidos", value: sometidos.length, color: "bg-yellow-500", icon: Building },
    { label: "Cerrados", value: cerrados.length, color: "bg-green-600", icon: CheckCircle },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">PlanGuard</h1>
      <p className="text-gray-500 mb-8">Centro de Control de Proyectos</p>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className={`${stat.color} text-white p-2 rounded-full mb-2`}>
              <stat.icon size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="font-semibold text-lg text-slate-800">Proyectos Activos</h2>
          <a href="/nuevo" className="bg-slate-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            + Nuevo proyecto
          </a>
        </div>

        <Buscador />

        <div className="overflow-x-auto">
          <table id="tabla-proyectos" className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 text-slate-700 font-semibold">Proyecto</th>
                <th className="p-3 text-slate-700 font-semibold">Cliente</th>
                <th className="p-3 text-slate-700 font-semibold">Fase</th>
                <th className="p-3 text-slate-700 font-semibold">Dependencia</th>
                <th className="p-3 text-slate-700 font-semibold">Responsable</th>
                <th className="p-3 text-slate-700 font-semibold">Próx. seguimiento</th>
                <th className="p-3 text-slate-700 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {proyectosList.map((proyecto) => {
                const isAtrasado =
                  proyecto.fecha_proximo_seguimiento &&
                  new Date(proyecto.fecha_proximo_seguimiento) < new Date();

                return (
                  <tr
                    key={proyecto.id}
                    className={`border-t border-slate-100 hover:bg-slate-50 transition ${
                      isAtrasado ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold">
                      <a
                        href={`/proyectos/${proyecto.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {proyecto.nombre}
                      </a>
                    </td>
                    <td className="p-3 text-gray-600">
                      {proyecto.cliente?.nombre || "—"}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {proyecto.fase_actual}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proyecto.dependencia === "Depende del cliente"
                            ? "bg-orange-50 text-orange-700"
                            : proyecto.dependencia === "Depende de PlanGuard"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {proyecto.dependencia}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{proyecto.responsable_interno || "—"}</td>
                    <td className="p-3 text-gray-600">
                      {proyecto.fecha_proximo_seguimiento
                        ? new Date(proyecto.fecha_proximo_seguimiento).toLocaleDateString("es-ES")
                        : "—"}
                    </td>
                    <td className="p-3">
                      {isAtrasado ? (
                        <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle size={10} /> Atrasado
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Al día
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}