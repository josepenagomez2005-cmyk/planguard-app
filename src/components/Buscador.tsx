"use client";

export default function Buscador() {
  return (
    <div className="px-4 py-2">
      <input
        type="text"
        placeholder="Buscar proyecto..."
        className="border rounded px-3 py-1 text-sm w-full md:w-64"
        onChange={(e) => {
          const filtro = e.target.value.toLowerCase();
          document.querySelectorAll("#tabla-proyectos tbody tr").forEach((row: any) => {
            const nombre = row.cells[0]?.textContent?.toLowerCase() || "";
            row.style.display = nombre.includes(filtro) ? "" : "none";
          });
        }}
      />
    </div>
  );
}