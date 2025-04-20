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


app.post("/api/budas", upload.single("img"), (req,res)=>{
  const result = validateBudaHouse(req.body);


  if(result.error){
      console.log("I have an error");
      res.status(400).send(result.error.details[0].message);
      return;
  }

  const buda = {
      _id: budas.length,
      name:req.body.name,
      description:req.body.description,
      rating:req.body.rating,
  };

  //adding image
  if(req.file){
      buda.main_image = req.file.filename;
  }

  budas.push(buda);
  res.status(200).send(buda);
});

app.put("/api/budas/:id", upload.single("img"),(req,res)=>{
  const buda = budas.find((buda)=>buda._id===parseInt(req.params.id));

  if(!buda){
      res.status(404).send("The bdua with the provided id was not found");
      return;
  }

  const result = validateBuda(req.body);

  if(result.error){
      res.status(400).send(result.error.details[0].message);
      return;
  }

  buda.name = req.body.name;
  buda.description = req.body.description;
  buda.rating = req.body.rating;


  if(req.file){
      bdua.main_image = req.file.filename;
  }

  res.status(200).send(buda);
});


const validateBuda = (buda) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
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

