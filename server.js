const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();
const mongoose = require("mongoose");

//testdb is name of database, it will automatically make it
mongoose
  .connect("mongodb+srv://mollyfmason1:molly12345!@cluster0.pn1joxb.mongodb.net/")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const budaSchema = new mongoose.Schema({
  name: String,
  description: String, 
  rating: Number,
  main_image: String
});
//mongo automatically includes the id



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

const Buda = mongoose.model("Buda", budaSchema);



app.get("/api/budas", async(req, res) => {
  const budas = await Buda.find();
  console.log(budas);
  res.send(budas);
});

app.get("/api/budas/:id", async (req,res) => {
  const houses = await Buda.findOne({_id: id});
  res.send(buda);
});


// POST new buda
app.post("/api/budas", upload.single("img"), async (req, res) => {
  const result = validateBuda(req.body);
  if (result.error) {
    console.log("Validation error:", result.error.details[0].message);
    return res.status(400).send(result.error.details[0].message);
  }

  const buda = new Buda ({
    //_id: budas.length + 1,
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
  });

  if (req.file) {
    buda.img = "images/" + req.file.filename;
  }


  const newBuda = await buda.save();
  res.status(200).send(newBuda);
});

// PUT to edit buda
app.put("/api/budas/:id", upload.single("img"), async (req, res) => {
  const buda = budas.find((b) => b._id === parseInt(req.params.id));
  if (!buda) return res.status(404).send("Buda not found");

  const result = validateBuda(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  let fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
  }
  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const wentThrough = await Buda.updateOne(
    {_id: req.params.id }, //list of properties and values to find
    fieldsToUpdate
  );

  const updatedBuda = await Buda.findOne({_id: req.params.id });
  res.send(updatedBuda);

  res.status(200).send(buda);
});

// DELETE a buda
app.delete("/api/buda/:id", async (req, res) => {
  const buda = await Buda.findByIdAndDelete(req.params.id );
  res.send(buda);
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
