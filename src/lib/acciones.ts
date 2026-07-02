"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function cambiarFase(proyectoId: string, faseNueva: string) {
  const { data: proyecto } = await supabase
    .from("proyectos")
    .select("fase_actual")
    .eq("id", proyectoId)
    .single();

  const faseAnterior = proyecto?.fase_actual;

  const { error: errorUpdate } = await supabase
    .from("proyectos")
    .update({ fase_actual: faseNueva, updated_at: new Date().toISOString() })
    .eq("id", proyectoId);

  if (errorUpdate) throw new Error(errorUpdate.message);

  const { error: errorHistorial } = await supabase
    .from("historial_estados")
    .insert({
      proyecto_id: proyectoId,
      fase_anterior: faseAnterior,
      fase_nueva: faseNueva,
      cambiado_por: "Usuario",
    });

  if (errorHistorial) throw new Error(errorHistorial.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}

export async function completarPendiente(pendienteId: string, proyectoId: string) {
  const { error } = await supabase
    .from("pendientes")
    .update({
      estado: "Completado",
      fecha_completado: new Date().toISOString(),
    })
    .eq("id", pendienteId);

  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}

export async function crearProyecto(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cliente_id = formData.get("cliente_id") as string;
  const direccion_propiedad = formData.get("direccion_propiedad") as string;
  const tipo_proyecto = formData.get("tipo_proyecto") as string;
  const responsable_interno = formData.get("responsable_interno") as string;

  const { error } = await supabase.from("proyectos").insert({
    nombre,
    cliente_id: cliente_id || null,
    direccion_propiedad,
    tipo_proyecto,
    responsable_interno,
    fase_actual: "Cliente interesado",
    dependencia: "Depende de PlanGuard",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function eliminarProyecto(proyectoId: string) {
  const { error } = await supabase
    .from("proyectos")
    .delete()
    .eq("id", proyectoId);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function enviarRecordatorioPendiente(
  pendienteId: string,
  proyectoId: string,
  emailCliente: string,
  nombreProyecto: string,
  descripcion: string
) {
  const { enviarRecordatorio } = await import("@/lib/email");

  const resultado = await enviarRecordatorio(
    emailCliente,
    nombreProyecto,
    `Hola,\n\nTe recordamos que tienes pendiente: "${descripcion}" para el proyecto "${nombreProyecto}".\n\nPor favor, contáctanos si tienes dudas.\n\n— PlanGuard`
  );

  if (resultado.success) {
    await supabase
      .from("pendientes")
      .update({ ultimo_recordatorio_enviado: new Date().toISOString() })
      .eq("id", pendienteId);
  }

  revalidatePath(`/proyectos/${proyectoId}`);
}