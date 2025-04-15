const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let budas = [
  {
    _id: 1,
    name: "Boat Tour",
    description: "This boat tour",
    rating: 9,
    main_image: "images/",
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

app.get("/api/budas", (req, res) => {
  res.send(budas);
});

app.post("/api/budas", upload.single("img"), (req, res) => {
  const result = validateBuda(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const buda = {
    _id: budas.length + 1,
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
  };

  if (req.file) {
    buda.main_image = "images/" + req.file.filename;
  }

  budas.push(buda);
  res.status(200).send(buda);
});

app.put("/api/budas/:id", upload.single("img"), (req, res) => {
  let buda = budas.find((h) => h._id === parseInt(req.params.id));

  if (!buda) res.status(400).send("Buda with given id was not found");

  const result = validateBuda(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  buda.name = req.body.name;
  buda.description = req.body.description;
  buda.rating = req.body.rating;

  if (req.file) {
    buda.main_image = "images/" + req.file.filename;
  }

  res.send(buda);
});

app.delete("/api/buda/:id", (req, res) => {
  const buda = budas.find((h) => h._id === parseInt(req.params.id));

  if (!buda) {
    res.status(404).send("The buda with the given id was not found");
  }

  const index = budas.indexOf(buda);
  budas.splice(index, 1);
  res.send(buda);
});

const validateBuda = (buda) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    descrtption: Joi.string().required(),
    rating: Joi.number().required(),
  });

  return schema.validate(buda);
};

app.listen(3002, () => {
  console.log("I'm listening");
});