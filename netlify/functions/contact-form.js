import nodemailer from 'nodemailer';

// Configuración del transporter usando variables de entorno
// Debes definir en Netlify (Environment variables):
// SMTP_HOST, SMTP_PORT, SMTP_SECURE (true/false), SMTP_USER, SMTP_PASS,
// MAIL_FROM, MAIL_TO

export async function handler(event, context) {
   // CORS preflight
   if (event.httpMethod === 'OPTIONS') {
      return {
         statusCode: 200,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
         },
         body: '',
      };
   }

   if (event.httpMethod !== 'POST') {
      return {
         statusCode: 405,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'Method not allowed' }),
      };
   }

   // Validar variables de entorno mínimas
   const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO'];

   const missingEnv = requiredEnv.filter((key) => !process.env[key]);
   if (missingEnv.length > 0) {
      return {
         statusCode: 500,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({
            error: 'Missing environment variables',
            missing: missingEnv,
         }),
      };
   }

   let data;
   try {
      data = JSON.parse(event.body || '{}');
   } catch (err) {
      return {
         statusCode: 400,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
   }

   const { name, email, phone, message, subject, service } = data;

   if (!name || !email || !message) {
      return {
         statusCode: 400,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({
            error: 'Missing required fields: name, email, message',
         }),
      };
   }

   const secureFlag = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';

   const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || (secureFlag ? 465 : 587),
      secure: true,
      auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
   });

   const mailSubject = subject || 'Nuevo mensaje desde el formulario de contacto';

   const htmlBody = `
      <!DOCTYPE html>
      <html lang="es">
         <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${mailSubject}</title>
         </head>
         <body
            style="margin:0;padding:0;background-color:#f0f8fd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"
         >
            <table
               width="100%"
               cellpadding="0"
               cellspacing="0"
               role="presentation"
               style="background-color:#f0f8fd;padding:24px 0;"
            >
               <tr>
                  <td align="center">
                     <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="max-width:640px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9eef8;box-shadow:0 10px 25px rgba(8,27,39,0.09);"
                     >
                        <tr>
                           <td
                              style="background:linear-gradient(135deg,#3a94c2,#1e5c80);padding:20px 24px;color:#f0f8fd;"
                           >
                              <h1
                                 style="margin:0;font-size:20px;line-height:1.4;font-weight:800;letter-spacing:0.03em;text-transform:uppercase;"
                              >
                                 Tienes un nuevo mensaje de contacto
                              </h1>
                              <p style="margin:4px 0 0;font-size:13px;opacity:0.95;">
                                 Recibiste un nuevo mensaje desde el formulario de tu sitio web.
                              </p>
                           </td>
                        </tr>

                        <tr>
                           <td style="padding:20px 24px 8px 24px;background-color:#ffffff;">
                              <p style="margin:0 0 12px 0;font-size:14px;color:#1f2933;">
                                 <strong style="color:#081b27;">Nombre:</strong>
                                 <span style="color:#081b27;">${name}</span>
                              </p>
                              <p style="margin:0 0 12px 0;font-size:14px;color:#1f2933;">
                                 <strong style="color:#081b27;">Email:</strong>
                                 <a
                                    href="mailto:${email}"
                                    style="color:#2878a4;text-decoration:none;font-weight:600;"
                                 >
                                    ${email}
                                 </a>
                              </p>
                              ${
                                 phone
                                    ? `<p style="margin:0 0 12px 0;font-size:14px;color:#1f2933;"><strong style=\"color:#081b27;\">Teléfono:</strong> <a href=\"tel:${phone}\" style=\"color:#2878a4;text-decoration:none;font-weight:600;\">${phone}</a></p>`
                                    : ''
                              }
                              ${
                                 service
                                    ? `<p style="margin:0 0 12px 0;font-size:14px;color:#1f2933;"><strong style=\"color:#081b27;\">Servicio de interés:</strong> <span style=\"color:#081b27;\">${service}</span></p>`
                                    : ''
                              }

                              <div
                                 style="margin:16px 0 8px 0;padding:14px 16px;background-color:#f0f8fd;border-radius:12px;border:1px solid #b0dbf1;"
                              >
                                 <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#2878a4;">
                                    Mensaje
                                 </p>
                                 <p style="margin:0;font-size:14px;line-height:1.6;color:#081b27;white-space:pre-line;">
                                    ${message}
                                 </p>
                              </div>
                           </td>
                        </tr>

                        <tr>
                           <td style="padding:12px 24px 20px 24px;border-top:1px solid #d9eef8;background-color:#f0f8fd;">
                              <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;">
                                 Este correo fue generado automáticamente desde el sitio web.
                              </p>
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
            </table>
         </body>
      </html>
   `;

   const textBody = `
Nuevo mensaje desde el formulario de contacto

Nombre: ${name}
Email: ${email}
${phone ? `Teléfono: ${phone}\n` : ''}${service ? `Servicio de interés: ${service}\n` : ''}
Mensaje:
${message}
  `;

   const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: mailSubject,
      text: textBody,
      html: htmlBody,
   };

   try {
      const info = await transporter.sendMail(mailOptions);

      return {
         statusCode: 200,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            success: true,
            messageId: info.messageId,
         }),
      };
   } catch (error) {
      console.error('Error sending email:', error);
      return {
         statusCode: 500,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            error: 'Failed to send email',
            message: error.message,
         }),
      };
   }
}
