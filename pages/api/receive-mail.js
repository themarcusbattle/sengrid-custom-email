import nextConnect from "next-connect";

const multer = require('multer');
const upload = multer()

// Create Twilio object
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

// Create the NextConnect Middleware
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Assign the Multer to the Middleware
apiRoute.use(upload.any());

// Forward the email as a text message
apiRoute.post((req, res) => {

  // Parse the email sent from SendGrid and convert to a text message
  const textMessage = `Subject: ${req.body.subject}\nFrom: ${req.body.from}\n\n${req.body.text}`

  // Send the text message
  client.messages
    .create({
      body: textMessage,
      to: process.env.FORWARDING_PHONE_NUMBER, // Text this number
      from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream IMPORTANT!!
  },
};