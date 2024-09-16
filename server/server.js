const express = require("express");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/shopfood";
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routes/user.route");
const product = require("./routes/product.route");
const category = require("./routes/category.route");
const cart = require("./routes/cart.route");
const order = require("./routes/order.route");
const app = express();
const path = require("path");
const port = 3002;

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/api", user);
app.use("/api/", product);
app.use("/api/", category);
app.use("/api/", cart);
app.use("/api/", order);
app.get("/", (req, res) => res.send("Hello World!"));

mongoose.connect(url);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
