const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "starnutri.mx@gmail.com",
    pass: "vtsm cuyu gakx yawp"
  },
});

const hotmailTransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "starnutri.mx@hotmail.com",
    pass: "startnutri1010"
  },
});

exports.enviarRespuesta = functions.https.onCall(async (data, context) => {
  const { correo, mensaje, respuesta } = data;

  let transporter;
  if (correo.includes("@hotmail.com") || correo.includes("@outlook.com")) {
    transporter = hotmailTransporter;
  } else {
    transporter = gmailTransporter;
  }

  const mailOptions = {
    from: transporter.options.auth.user,
    to: correo,
    subject: "Respuesta a tu consulta",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Tu mensaje:</h3>
        <p>${mensaje}</p>
        <hr>
        <h3>Te respondemos:</h3>
        <p>${respuesta}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { ok: true };
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new functions.https.HttpsError("internal", "Error al enviar correo");
  }
});

