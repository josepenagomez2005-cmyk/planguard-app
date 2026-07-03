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
export async function actualizarProyecto(proyectoId: string, formData: FormData) {
  const fecha_proximo_seguimiento = formData.get("fecha_proximo_seguimiento") as string;
  const responsable_interno = formData.get("responsable_interno") as string;
  const estado_pago = formData.get("estado_pago") as string;
  const dependencia = formData.get("dependencia") as string;
  const estado_permiso = formData.get("estado_permiso") as string;
  const notas_internas = formData.get("notas_internas") as string;
  const link_documentos = formData.get("link_documentos") as string;
  const tipo_proyecto = formData.get("tipo_proyecto") as string;

  const { error } = await supabase
    .from("proyectos")
    .update({
      fecha_proximo_seguimiento: fecha_proximo_seguimiento || null,
      responsable_interno: responsable_interno || null,
      estado_pago: estado_pago || null,
      dependencia: dependencia || null,
      estado_permiso: estado_permiso || null,
      notas_internas: notas_internas || null,
      link_documentos: link_documentos || null,
      tipo_proyecto: formData.get("tipo_proyecto") as string || null,
      updated_at: new Date().toISOString(),

    })
    .eq("id", proyectoId);

  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}
export async function crearPendiente(proyectoId: string, formData: FormData) {
  const descripcion = formData.get("descripcion") as string;
  const tipo = formData.get("tipo") as string;
  const responsable = formData.get("responsable") as string;
  const fecha_limite = formData.get("fecha_limite") as string;

  const { error } = await supabase.from("pendientes").insert({
    proyecto_id: proyectoId,
    descripcion,
    tipo,
    responsable,
    fecha_limite: fecha_limite || null,
    estado: "Pendiente",
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}
export async function eliminarPendiente(pendienteId: string, proyectoId: string) {
  const { error } = await supabase
    .from("pendientes")
    .delete()
    .eq("id", pendienteId);

  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}
export async function alternarPendiente(pendienteId: string, proyectoId: string, estadoActual: string) {
  const nuevoEstado = estadoActual === "Completado" ? "Pendiente" : "Completado";

  const { error } = await supabase
    .from("pendientes")
    .update({
      estado: nuevoEstado,
      fecha_completado: nuevoEstado === "Completado" ? new Date().toISOString() : null,
    })
    .eq("id", pendienteId);

  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/");
}