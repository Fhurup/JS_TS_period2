import express from "express"
const app = express();
import fetch from "node-fetch";

app.get("/whattodo", async (req, res) => {
  const whatToDo = await fetch("https://www.boredapi.com/api/activity").then(r => r.json())
  res.json(whatToDo)
})

app.get("/nameinfo/:name", async(req,res) => {
    const name = req.params.name;
    const promises = [
        fetch(`https://api.genderize.io?name=${name}`).then(r => r.json()),
        fetch(`https://api.nationalize.io?name=${name}`).then(r => r.json()),
        fetch(`https://api.agify.io?name=${name}`).then(r => r.json())
    ];
    const result = await Promise.all(promises);
    const response = { gender: result[0].gender, country: result[1].country[0].country_id, age: result[2].age }
    res.json(response);
})

export default app
