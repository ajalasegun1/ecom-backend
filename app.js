const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 8000;
const dbUrl = process.env.DBURL;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//DATABASE CONNECTION
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MONGO-DB ATLAS CONNECTED"))
  .catch((err) => console.log(err));
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
//APP
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//ROUTES
app.use("/apiv1/user", authRoutes);
app.use("/apiv1/user", userRoutes);
app.use("/apiv1/category", categoryRoutes);
app.use("/apiv1/product", productRoutes);
app.use("/apiv1/products", productRoutes);

//SERVER
app.listen(port, () => console.log(`Server running on port:${port}`));
