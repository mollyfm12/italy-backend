// Core dependencies
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();

// Middleware setup
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

// Multer config (file upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

// Sample data
let budas = [
  {
    _id: 1,
    name: "Boat Tour",
    description: "This boat tour",
    rating: 9,
    main_image: "images/boat.jpg",
  },
  {
    _id: 2,
    name: "Thermal Baths",
    description: "The thermal baths",
    rating: 6,
    main_image: "images/thermalBaths.jpg",
  },
  {
    _id: 3,
    name: "Chimney Cake",
    description: "Chimney Cake is a classic",
    rating: 8,
    main_image: "images/chimneyCake.jpg",
  },
];

// GET route for Budapest data
app.get("/api/budas", (req, res) => {
  res.send(budas);
});

// ❌ Commented routes for now
/*
app.post("/api/budas", upload.single("img"), (req, res) => { ... });
app.put("/api/budas/:id", upload.single("img"), (req, res) => { ... });
app.delete("/api/budas/:id", (req, res) => { ... });

const validateBuda = (buda) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    description: Joi.string().required(), // FIXED HERE
    rating: Joi.number().required(),
  });
  return schema.validate(buda);
};
*/

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

