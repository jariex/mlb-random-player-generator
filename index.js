import 'dotenv/config'
import express from "express";
import axios from "axios";
import { name } from "ejs";


const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
let randomId = 0;

app.use(express.static("styles"));


const config = {
    headers: {
        Authorization: API_KEY
   } 
};

app.get("/", (req, res) => {
    res.render("index.ejs", {
        name: "Your Random player is...",
        debut: null, 
        age: null, 
        height: null, 
        weight: null, 
        active: null, 
        birthplace: null, 
        position: null, 
        team: null
    });
    
});

app.post("/get-random-player", async (req, res) => {
    randomId = Math.floor(Math.random() * 2000) + 1;
    try {
        const result = await axios.get(`https://api.balldontlie.io/mlb/v1/players/${randomId}`, config);
        const player = result.data.data;

    // Mapea los datos del jugador con valores predeterminados si faltan
    const playerData = {
      name: player.full_name || "Unknown",
      debut: player.debut_year || "N/A",
      age: player.age || "N/A",
      height: player.height || "N/A",
      weight: player.weight || "N/A",
      active: player.active ? "Yes" : "No",
      birthplace: player.birth_place || "Unknown",
      position: player.position || "Unknown",
      team: player.team.display_name ? player.team.display_name : "No team",
    };
        res.render("index.ejs", playerData);
        
        
    } catch (error) {
        console.error("Error fetching player data:", error.message);
        res.render("index.ejs", {
            name: "Error fetching player",
            debut: "N/A",
            age: "N/A",
            height: "N/A",
            weight: "N/A",
            active: "N/A",
            birthplace: "N/A",
            position: "N/A",
            team: "N/A",
        });
        
    }
});



app.listen(port, () => {
    console.log("Server running on port", port)
});
