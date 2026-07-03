import Link from "next/link";

export default function Bienvenida() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Logo / Icono */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20">
            <span className="text-5xl font-black text-white">PG</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          PlanGuard
        </h1>

        {/* Línea decorativa */}
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full mb-6"></div>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
          Centro de Control de Proyectos de Diseño, Permisos y Remodelaciones
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "📋", title: "Proyectos", desc: "Controla todas las fases" },
            { icon: "⏰", title: "Pendientes", desc: "Nunca olvides una tarea" },
            { icon: "✉️", title: "Recordatorios", desc: "Emails automáticos" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-white font-semibold mt-2">{item.title}</h3>
              <p className="text-white/50 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Botón de entrada */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-3.5 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-100 hover:scale-105 transition-all"
        >
          Entrar al sistema
          <span className="text-xl">→</span>
        </Link>

        {/* Footer */}
        <p className="text-white/30 text-sm mt-8">
          © 2026 PlanGuard · Software de gestión interna
        </p>
      </div>
    </main>
  );
}