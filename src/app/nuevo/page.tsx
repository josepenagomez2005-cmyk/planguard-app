import { supabase } from "@/lib/supabase";
import { crearProyecto } from "@/lib/acciones";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NuevoProyecto() {
  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nombre")
    .order("nombre");

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6 font-medium text-sm md:text-base"
      >
        <ArrowLeft size={16} /> Volver
      </Link>

      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Nuevo Proyecto</h1>

        <form action={crearProyecto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del proyecto *
            </label>
            <input
              name="nombre"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 4151 McGirts Blvd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              name="cliente_id"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de la propiedad
            </label>
            <input
              name="direccion_propiedad"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 123 Main St, Jacksonville, FL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de proyecto *
            </label>
            <select
              name="tipo_proyecto"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="Planos de remodelación">Planos de remodelación</option>
              <option value="Remodelación residencial">Remodelación residencial</option>
              <option value="Permiso comercial">Permiso comercial</option>
              <option value="Diseño">Diseño</option>
              <option value="Revisión">Revisión</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable interno
            </label>
            <input
              name="responsable_interno"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Ana"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-slate-800 w-full transition font-medium"
          >
            Crear proyecto
          </button>
        </form>
      </div>
    </main>
  );
}