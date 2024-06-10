const express = require("express");
const router = express.Router();
const { Headers } = require("../models")

router.get("/", async (req, res) => {
    const listOfHeaders = await Headers.findAll()
    res.json(listOfHeaders)
})

router.post("/", async (req, res) => {
    const header = req.body
    await Headers.create(header)
    res.json(header)
})

module.exports = router