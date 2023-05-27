/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Abdalla Aden Student ID: 021-720-057 Date: May 22nd 2022
*  Heroku Link: https://cryptic-bayou-71026.herokuapp.com/
*
********************************************************************************/ 


const express = require("express");
var cors = require('cors')
const TripDB = require("./modules/tripsDB");
const db = new TripDB();


const app = express();

app.use(cors());
app.use(express.json());


var HTTP_PORT = process.env.PORT || 3000;

//console.log("Hello world")
app.get("/",(req,res)=>{
    res.json({message: "API Listening"});
});

app.post("/api/trips",(req,res)=>{
    db.addNewTrip(req.body).then((trip)=>{
        res.status(201).send(trip);
    }).catch((err)=>{
        res.status(500).send("Unable to add new Trip");
    })
    
});

app.get("/api/trips", (req, res) => {
    if ((!req.query.page || !req.query.perPage)) 
     res.status(500).json({ message: "Missing page and perPage query parameters" }) 
    else {
       db.getAllTrips(req.query.page, req.query.perPage)
        .then((trip) => {
            res.send(trip);
        }).catch((err)=>{
            res.status(400).send(""+ err);
        })}
});

app.get("/api/trips/:id",(req,res)=>{
    db.getTripById(req.params.id).then((trip)=>{
        res.send(trip);
    }).catch((err)=>{
        res.status(500).send("Could not find trip with id "+ req.params.id);
    })
});

app.put("/api/trips/:id",(req,res)=>{
    db.updateTripById(req.body,req.params.id).then(()=>{
        res.status(204).send("");
    }).catch((err)=>{
        res.status(500).send("Unable to update trip");
    })
});

app.delete("/api/trips/:id",(req,res)=>{
    db.deleteTripById(req.params.id).then(()=>{
        res.status(204).send("");
    }).catch((err)=>{
        res.status(500).send("Unable to delete trip");
    })
});

app.use((req, res) => {
    res.status(404).send("Not found");
  });

db.initialize("mongodb+srv://aaaden1:pass123@cluster0.ypecc.mongodb.net/sample_training?retryWrites=true&w=majority").then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

