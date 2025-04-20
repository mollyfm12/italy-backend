const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();

// Middleware
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

// Data array
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

// GET all budas
app.get("/api/budas", (req, res) => {
  res.send(budas);
});

// POST new buda
app.post("/api/budas", upload.single("img"), (req, res) => {
  const result = validateBuda(req.body);
  if (result.error) {
    console.log("Validation error:", result.error.details[0].message);
    return res.status(400).send(result.error.details[0].message);
  }

  const buda = {
    _id: budas.length + 1,
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
    main_image: req.file ? "images/" + req.file.filename : "",
  };

  budas.push(buda);
  res.status(200).send(buda);
});

// PUT to edit buda
app.put("/api/budas/:id", upload.single("img"), (req, res) => {
  const buda = budas.find((b) => b._id === parseInt(req.params.id));
  if (!buda) return res.status(404).send("Buda not found");

  const result = validateBuda(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  buda.name = req.body.name;
  buda.description = req.body.description;
  buda.rating = req.body.rating;
  if (req.file) {
    buda.main_image = "images/" + req.file.filename;
  }

  res.status(200).send(buda);
});

// DELETE a buda
app.delete("/api/buda/:id", (req, res) => {
  const buda = budas.find((b) => b._id === parseInt(req.params.id));
  if (!buda) return res.status(404).send("Buda not found");

  const index = budas.indexOf(buda);
  budas.splice(index, 1);
  res.status(200).send(buda);
});

// Joi validation
const validateBuda = (buda) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(2).required(),
    description: Joi.string().required(),
    rating: Joi.number().required(),
  });
  return schema.validate(buda);
};

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
