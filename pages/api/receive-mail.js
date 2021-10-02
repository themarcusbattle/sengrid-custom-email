import nextConnect from "next-connect";

const multer = require('multer');
const upload = multer()

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

// Do API logic
apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
  console.log(req.body)
  console.log('your email')
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream IMPORTANT!!
  },
};