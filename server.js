const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const postModel = require("./models/posts");
const {Configuration, OpenAIApi} = require ("openai");


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

require("dotenv").config();
const dbURL = process.env.MONG0DB_CONNECTION_URL;
API_KEY = process.env.OPENAI_API_KEY;

mongoose .connect(dbURL).then(() => console.log("Connected to MongoDB")).catch(console.error);



app.get("/feed", async (req, res) => {
  try {
    const feed = await postModel.find();
    res.json(feed);
  } catch (error) {
    res.send(error);
  }
});

app.post("/addpost", async (req, res) => {
  try {
    const requestData = req.body;
    const newPost = await new postModel(requestData);
    await newPost.save();

    res.json(requestData);
  } catch (error) {
    res.send(error);
  }
});

app.put("/post/:id/like", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postModel.findById(id);
    post.likes += 1;

    await post.save()

    res.json(post);
  } catch (error) {
    res.send(error);
  }
});

app.post ("/chatbot", async (req, res) => {
  const requestData = {model: "gpt-3.5-turbo", messages: [{ role: "system", content: req.body.message }] };
  const options = {
    method : "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}`},
    body: JSON.stringify(requestData)
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const responseData = await response.json();
    res.send(responseData);
  }

  catch (error) { 
    console.log(error)
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
