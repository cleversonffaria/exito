import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, code, studentName } = await req.json();

    console.log("📧 Enviando email de ativação...");

    if (!email || !code || !studentName) {
      throw new Error("Dados obrigatórios faltando");
    }

    // Usar Brevo (ex-Sendinblue) - SMTP gratuito com 300 emails/dia
    const emailPayload = {
      sender: {
        name: "Exito",
        email: "cleversonfaria.dev@gmail.com",
      },
      to: [
        {
          email: email,
          name: studentName,
        },
      ],
      subject: "Código de Ativação - Exito",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0;">Exito</h1>
          </div>
          
          <h2 style="color: #333;">Bem-vindo, ${studentName}!</h2>
          
          <p style="font-size: 16px; color: #555;">
            Sua conta foi criada com sucesso no Exito. 
            Para ativar sua conta, use o código abaixo:
          </p>
          
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); 
                      padding: 30px; 
                      text-align: center; 
                      margin: 30px 0; 
                      border-radius: 10px;
                      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);">
            <h1 style="color: white; 
                       font-size: 48px; 
                       margin: 0; 
                       letter-spacing: 8px; 
                       font-weight: bold;
                       text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${code}
            </h1>
          </div>
          
          <div style="background: #f0fdf4; 
                      padding: 20px; 
                      border-radius: 8px; 
                      margin: 20px 0;
                      border-left: 4px solid #22c55e;">
            <h3 style="color: #16a34a; margin-top: 0;">📱 Como ativar:</h3>
            <ol style="color: #555; line-height: 1.6;">
              <li>Abra o aplicativo <strong>Exito</strong></li>
              <li>Toque em <strong>"Primeiro Acesso"</strong></li>
              <li>Digite seu email: <strong>${email}</strong></li>
              <li>Digite o código: <strong>${code}</strong></li>
              <li>Crie sua senha segura</li>
            </ol>
          </div>
          
          <div style="background: #fef3c7; 
                      border: 1px solid #f59e0b; 
                      padding: 15px; 
                      border-radius: 5px; 
                      margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              ⚠️ <strong>Importante:</strong> Este código expira em <strong>24 horas</strong>
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Este email foi enviado automaticamente. Não responda a este email.<br>
            Se você não solicitou esta ativação, ignore este email.
          </p>
        </div>
      `,
      textContent: `
        Bem-vindo ao Exito, ${studentName}!
        
        Sua conta foi criada com sucesso. Para ativar, use o código: ${code}
        
        Como ativar:
        1. Abra o app Exito
        2. Toque em "Primeiro Acesso"  
        3. Digite seu email: ${email}
        4. Digite o código: ${code}
        5. Crie sua senha
        
        Este código expira em 24 horas.
      `,
    };

    // Debug da API Key
    const apiKey = Deno.env.get("BREVO_API_KEY");
    console.log("🔑 API Key configurada:", apiKey ? "✅ Sim" : "❌ Não");
    console.log(
      "🔑 Primeiros 10 chars:",
      apiKey ? apiKey.substring(0, 10) + "..." : "N/A"
    );

    if (!apiKey || apiKey === "temp-key") {
      console.log("⚠️ API Key não configurada, usando fallback");

      console.log("🔄 FALLBACK - CÓDIGO NO CONSOLE:");
      console.log(
        "============================================================"
      );
      console.log(`📧 DESTINATÁRIO: ${email}`);
      console.log(`👤 NOME: ${studentName}`);
      console.log(`🔑 CÓDIGO DE ATIVAÇÃO: ${code}`);
      console.log(
        "============================================================"
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: "Código gerado (API Key não configurada)",
          code: code,
          fallback: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("📤 Enviando via Brevo SMTP...");

    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await emailResponse.json();
    console.log("📨 Status:", emailResponse.status);
    console.log("📨 Resposta Brevo:", responseData);

    if (!emailResponse.ok) {
      console.error("❌ Erro Brevo:", responseData);
      throw new Error(
        `Falha no envio do email: ${
          responseData.message || "Erro desconhecido"
        }`
      );
    }

    console.log("✅ Email enviado com sucesso via Brevo!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email enviado com sucesso",
        messageId: responseData.messageId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("💥 Erro:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
