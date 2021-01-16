const express = require("express");
const axios = require('axios')
const seedRoutes = express.Router();
let jwt = require("jsonwebtoken");
let Seed = require("./seedSchema");
let User = require("./userSchema");
let Interval = require("./intervalSchema");
const bcrypt = require('bcrypt');
//const cors = require("cors");
const app = express()

// app.use(cors())

seedRoutes.route("/getDefaultIntervals").get((req, res) => {
  try {
    const intervals = await Interval.find({ 'fullScanInterval' : { $exists: true, $ne: null } })
    if (intervals.length) {
      res.status(200).send(intervals[0])
    } else throw 'no intervals found'
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

seedRoutes.route("/fetchAll").get((req, res) => {
  Seed.find({}, "page _id isSpa method numberOfChildren")
    .then(seeds => {
      res.status(200).send(seeds);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

seedRoutes.route("/login").post((req, res) => {
  loginManage(req, res)
})

seedRoutes.use((req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, "superSecret", (err, decoded) => {
      if (err) {
        return res.json({
          status: 403,
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: 403,
      success: false,
      message: "No token provided."
    });
  }
});

seedRoutes.route("/add").post((req, res) => {
  let seed = new Seed({
    page: req.body.page,
    isSpa: req.body.isSpa,
    method: req.body.method,
    numberOfChildren: req.body.numberOfChildren
  });
  seed
    .save()
    .then(() => {
      res.status(200).send("saved!");
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

seedRoutes.route("/removeSeeds").post((req, res) => {
  Seed.deleteMany({ _id: req.body })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});



seedRoutes.route("/configure").post((req, res) => {
  changeIntervalCall(req, res)
})

async function changeIntervalCall(req, res){
  try{
    let result = await axios.post('https://ast-ntin-crawler.herokuapp.com/api/changeInterval', req.body)
    const intervals = await Interval.find({ 'fullScanInterval' : { $exists: true, $ne: null } })
    if (intervals.length) {
      intervals[0].fullScanInterval = req.body.crawlFreq
      intervals[0].updateContentTime = req.body.updateFreq
      await intervals[0].save()
    } else throw 'no intervals found'
    res.status(200).send(result.data)
  } catch(err){
    console.log(err)
    res.status(400).send(err)
  }
}

async function loginManage(req, res){
  try {
    const user = await User.findOne({ username: req.body.username})
    let match
    if(user) {
      match = await bcrypt.compare(req.body.password, user.password)
    }
    if(user && match){
      const payload = {
        username: user.username
      };
      let token = jwt.sign(payload, "superSecret", {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
      })
      res.json({
        message: "OK",
        token: token
      })
      res.status(200).send()
    } else {
      res.status(401).send({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).send({message: 'A Server Error Occured!'})
  }
}
module.exports = seedRoutes;
