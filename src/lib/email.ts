import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function enviarRecordatorio(
  emailCliente: string,
  nombreProyecto: string,
  mensaje: string
) {
  const { data, error } = await resend.emails.send({
    from: "PlanGuard <onboarding@resend.dev>",
    to: [emailCliente],
    subject: `Recordatorio: ${nombreProyecto}`,
    text: mensaje,
  });

  if (error) {
    console.error("Error al enviar email:", error);
    return { success: false, error };
  }

  return { success: true, data };
}