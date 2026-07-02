import { supabase } from "@/lib/supabase";
import { AlertTriangle, Clock, UserCheck, Wrench, Building, CheckCircle } from "lucide-react";

export default async function Home() {
  const { data: proyectos } = await supabase.from("proyectos").select("*");

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
  const listosCerrar = proyectosList.filter(
    (p) => p.fase_actual === "Aprobado"
  );

  const stats = [
    { label: "Total proyectos", value: proyectosList.length, color: "bg-blue-500", icon: Wrench },
    { label: "Esperando cliente", value: esperandoCliente.length, color: "bg-orange-500", icon: UserCheck },
    { label: "En desarrollo", value: enDesarrollo.length, color: "bg-purple-500", icon: Wrench },
    { label: "Atrasados", value: atrasados.length, color: "bg-red-500", icon: AlertTriangle },
    { label: "Sometidos", value: sometidos.length, color: "bg-yellow-500", icon: Building },
    { label: "Listos cerrar", value: listosCerrar.length, color: "bg-green-500", icon: CheckCircle },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">PlanGuard</h1>
      <p className="text-gray-500 mb-8">Centro de Control de Proyectos</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
            <div className={`${stat.color} text-white p-2 rounded-full mb-2`}>
              <stat.icon size={20} />
            </div>
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
  <h2 className="font-semibold text-lg">Proyectos Activos</h2>
  <a href="/nuevo" className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
    + Nuevo proyecto
  </a>
</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Proyecto</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fase</th>
                <th className="p-3">Dependencia</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Próx. seguimiento</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {proyectosList.map((proyecto) => {
                const isAtrasado =
                  proyecto.fecha_proximo_seguimiento &&
                  new Date(proyecto.fecha_proximo_seguimiento) < new Date();

                return (
                  <tr key={proyecto.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      <a
                        href={`/proyectos/${proyecto.id}`}
                        style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}
                      >
                        {proyecto.nombre}
                      </a>
                    </td>
                    <td className="p-3 text-gray-500">—</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {proyecto.fase_actual}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          proyecto.dependencia === "Depende del cliente"
                            ? "bg-orange-100 text-orange-700"
                            : proyecto.dependencia === "Depende de PlanGuard"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {proyecto.dependencia}
                      </span>
                    </td>
                    <td className="p-3">{proyecto.responsable_interno || "—"}</td>
                    <td className="p-3">
                      {proyecto.fecha_proximo_seguimiento
                        ? new Date(proyecto.fecha_proximo_seguimiento).toLocaleDateString("es-ES")
                        : "—"}
                    </td>
                    <td className="p-3">
                      {isAtrasado ? (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> Atrasado
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
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