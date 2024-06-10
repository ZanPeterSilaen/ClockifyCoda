const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require('./models');

// Router
const postRouter = require("./routes/Headers");
app.use("/headers", postRouter)

db.sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Listening on port...");
    })
})