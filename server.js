const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://mollyfmason1:molly12345!@cluster0.pn1joxb.mongodb.net/")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// ✅ Mongoose Schema and Model
const budaSchema = new mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  main_image: String,
});
const Buda = mongoose.model("Buda", budaSchema);

// ✅ Middleware
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://mollyfm12.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

// ✅ Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

// ✅ Seed data if DB is empty
const seedInitialBudas = async () => {
  const count = await Buda.countDocuments();
  if (count === 0) {
    await Buda.insertMany([
      {
        name: "Boat Tour",
        description: "This boat tour",
        rating: 9,
        main_image: "images/boat.jpg",
      },
      {
        name: "Thermal Baths",
        description: "The thermal baths",
        rating: 6,
        main_image: "images/thermalBaths.jpg",
      },
      {
        name: "Chimney Cake",
        description: "Chimney Cake is a classic",
        rating: 8,
        main_image: "images/chimneyCake.jpg",
      },
    ]);
    console.log("✅ Seeded default Budas.");
  } else {
    console.log("🔄 Budas already exist.");
  }
};
seedInitialBudas();

// ✅ Routes

// GET all budas
app.get("/api/budas", async (req, res) => {
  try {
    let budas = await Buda.find();

    // If no budas in DB, insert the defaults
    if (budas.length === 0) {
      const defaultBudas = [
        {
          name: "Boat Tour",
          description: "This boat tour",
          rating: 9,
          main_image: "images/boat.jpg",
        },
        {
          name: "Thermal Baths",
          description: "The thermal baths",
          rating: 6,
          main_image: "images/thermalBaths.jpg",
        },
        {
          name: "Chimney Cake",
          description: "Chimney Cake is a classic",
          rating: 8,
          main_image: "images/chimneyCake.jpg",
        },
      ];

      await Buda.insertMany(defaultBudas);
      console.log("Inserted default budas!");
      budas = await Buda.find(); // Fetch again
    }

    res.send(budas);
  } catch (err) {
    console.error("Error fetching budas:", err);
    res.status(500).send("Server error");
  }
});



// GET one buda by ID
app.get("/api/budas/:id", async (req, res) => {
  const buda = await Buda.findOne({ _id: req.params.id });
  if (!buda) return res.status(404).send("Buda not found");
  res.send(buda);
});

// POST a new buda
app.post("/api/budas", upload.single("img"), async (req, res) => {
  try {
    const result = validateBuda(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }

    const buda = new Buda({
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      main_image: req.file ? "images/" + req.file.filename : "",
    });

    const savedBuda = await buda.save();
    res.status(200).send(savedBuda);
  } catch (err) {
    console.error("Server error during POST:", err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT (edit) a buda
app.put("/api/budas/:id", upload.single("img"), async (req, res) => {
  const result = validateBuda(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
  };
  if (req.file) {
    fieldsToUpdate.main_image = "images/" + req.file.filename;
  }

  const updated = await Buda.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });
  if (!updated) return res.status(404).send("Buda not found");

  res.send(updated);
});

// DELETE a buda
app.delete("/api/budas/:id", async (req, res) => {
  const deleted = await Buda.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).send("Buda not found");
  res.send(deleted);
});


// ✅ Joi validation function
const validateBuda = (buda) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().required(),
    rating: Joi.number().required(),
  });
  return schema.validate(buda);
};

// ✅ Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await seedInitialBudas();
});


/*
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
//app.use(cors());
const corsOptions = {
  origin: ["http://localhost:3000", "https://mollyfm12.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
};

app.use(cors(corsOptions));


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
  try {
    console.log("POST /api/budas hit");

    const result = validateBuda(req.body);
    if (result.error) {
      console.log("Validation error:", result.error.details[0].message);
      return res.status(400).send(result.error.details[0].message);
    }

    console.log("Request body:", req.body);
    console.log("File:", req.file);

    const buda = new Buda({
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
    });
    if (req.file) {
      buda.main_image = "images/" + req.file.filename;
    }
    

    const newBuda = await buda.save();
    console.log("Buda saved:", newBuda);
    res.status(200).send(newBuda);
  } catch (err) {
    console.error("Server error during POST /api/budas:", err);
    res.status(500).send("Internal Server Error");
  }
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
*/
