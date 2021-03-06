require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const flash = require('connect-flash');
const uniqueValidator=require('mongoose-unique-validator');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const loading = multer({ dest: "public/uploads/" });
const Schema = mongoose.Schema;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "Ourlittlesecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(`mongodb+srv://${process.env.DATABASE_ID}:${process.env.DATABASE_PASSWORD}@cluster0.rfaz9.mongodb.net/Resume`, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const UserSchema = new Schema({
  firstname: { type: String, default: null },
  profile: { type: String, default: null },
  email: { type: String, default: null },
  pno: { type: Number, default: null },
  website: { type: String, default: null },
  github: { type: String, default: null },
  linkedin: { type: String, default: null },
  twitter: { type: String, default: null },
  country: { type: String, default: null },
  state: { type: String, default: null },
  city: { type: String, default: null },
  pin: { type: String, default: null },
  address: { type: String, default: null },
  currentposition: { type: String, default: null },
  img: { type: String, default: null },
  school: [
    {
      name: [{ type: String, default: null }],
      startdate: [{ type: Date, default: Date.now}],
      enddate: [{ type: Date, default: Date.now, }],
      degree: [{ type: String, default: null }],
      gpa: [{ type: Number, default: null }],
      location: [{ type: String, default: null }],
    },
  ],
  work: [
    {
      companyname: [{ type: String, default: null }],
      jobtitle: [{ type: String, default: null }],
      state: [{ type: String, default: null }],
      city: [{ type: String, default: null }],
      startdate: [{ type: Date, default: null, }],
      enddate: [{ type: Date, default: null ,}],
      jobdescription: [{ type: String, default: null }],
    },
  ],
  skills: [
    {
      skillsname: [{ type: String, default: null }],
      skillsdetails: [{ type: Number, default: 0 }],
    },
  ],
  project: [
    {
      projectname: [{ type: String, default: null }],
      project1description: [{ type: String, default: null }],
      link: [{ type: String, default: null }],
      toolsused: [{ type: String, default: null }],
    },
  ],
  awards: [
    {
      awardname: [{ type: String, default: null }],
      awarddate: [{ type: Date, default: null, }],
      awarder: [{ type: String, default: null }],
      Awarddescription: [{ type: String, default: null }],
    },
  ],
  extra: [
    {
      hobbie: [{ type: String, default: null }],
      strength: [{ type: String, default: null }],
      language: [{ type: String, default: null }],
      goals: [{ type: String, default: null }],
    },
  ],
  username: { type: String, default: null},
  password: { type: String, default: null },
  loginid:  { type: String, default: null,unique:true},
  googleId: { type: String},
  facebookId: { type: String},
  twitterId: { type: String},
  linkedInId: { type: String},
  githubId: { type: String},
  secret: { type: String, default: null },
  resetPasswordToken: { type: String},
  resetPasswordExpires: { type: Date},
   noOfeducation: { type: Number, default: 1 },
   noOfProjects: { type: Number, default: 1 },
   noOfSkills: { type: Number, default: 1 },
   noOfWorkExperience: { type: Number, default: 1 },
   noOfAwards: { type: Number, default: 1 },
   filepresentornot: { type: Number, default: 0 },
   noOfhobbies: { type: Number, default: 1 },
   noOfStrengths: { type: Number, default: 1 },
   noOfLanguage: { type: Number, default: 1 },
   noOfGoals: { type: Number, default: 1 },
   visitedProfile: { type: Number, default: 0 },
   visitedEducation: { type: Number, default: 0 },
   visitedSkills: { type: Number, default: 0 },

});
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
UserSchema.plugin(passportLocalMongoose, { usernameQueryFields: ['loginid'] });
UserSchema.plugin(uniqueValidator)
const Project = mongoose.model("Project", UserSchema);
 
  
passport.use(Project.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Project.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/google/secrets",
      callbackURL: "https://damp-beach-49352.herokuapp.com/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      Project.findOrCreate({ googleId: profile.id,loginid:profile.id,username:profile.displayName }, function (err, user) {
       
        return cb(err, user);
      });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.Facebook_CLIENT_ID,
      clientSecret: process.env.Facebook_CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/facebook/key",
      callbackURL: "https://damp-beach-49352.herokuapp.com/auth/facebook/key",
    },
    function (accessToken, refreshToken, profile, cb) {
      Project.findOrCreate({ facebookId: profile.id,loginid:profile.id,username:profile.displayName }, function (err, user) {
        console.log(err);
        return cb(err, user);
       
      });
    }
  )
);
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.Twitter_CLIENT_ID,
      consumerSecret: process.env.Twitter_CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/twitter/importantkey",
      callbackURL: "https://damp-beach-49352.herokuapp.com/auth/twitter/importantkey",
    },
    function (token, tokenSecret, profile, cb) {
      Project.findOrCreate({ twitterId: profile.id,loginid:profile.id,username:profile.username }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
passport.use(new LinkedInStrategy({
  clientID: process.env.LinkedIn_CLIENT_ID,
  clientSecret:process.env.LinkedIn_CLIENT_SECRET,
  // callbackURL: "http://localhost:3000/auth/linkedin/keyy",
  callbackURL: "https://damp-beach-49352.herokuapp.com/auth/linkedin/keyy",
  scope: ['r_liteprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  Project.findOrCreate({ linkedInId: profile.id,loginid:profile.id,username:profile.displayName }, function (err, user) {
   
    return done(err, user);
  });
}));
passport.use(new GitHubStrategy({
  clientID: process.env.Github_CLIENT_ID,
  clientSecret: process.env.Github_CLIENT_SECRET,
  // callbackURL: "http://localhost:3000/auth/github/token"
  callbackURL: "https://damp-beach-49352.herokuapp.com/auth/github/token"
},
function(accessToken, refreshToken, profile, done) {
  Project.findOrCreate({ githubId: profile.id,loginid:profile.id,username:profile.username }, function (err, user) {
  
    return done(err, user);
  });
}
));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/${req.user.id}/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
app.get('/favicon.ico', (req, res) => res.status(204));
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/auth/google/login" }),
  function (req, res) {
    const loader = multer({ dest: `public/uploads/${req.user.id}/` });
    res.redirect("/");
  }
);
app.get("/auth/facebook", passport.authenticate("facebook",{ scope: ["public_profile"]}));
app.get(
  "/auth/facebook/key",
  passport.authenticate("facebook", { failureRedirect: "/auth/facebook/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    const loader = multer({ dest: `public/uploads/${req.user.id}/` });
    res.redirect("/");
  }
);
app.get("/auth/twitter", passport.authenticate("twitter", { scope: ["profile"]}));
app.get(
  "/auth/twitter/importantkey",
  passport.authenticate("twitter", { failureRedirect: "/auth/twitter/login" }),
  function (req, res) {
    const loader = multer({ dest: `public/uploads/${req.user.id}/` });
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.get("/auth/linkedin", passport.authenticate("linkedin", { scope: ['r_liteprofile']}));
app.get(
  "/auth/linkedin/keyy",
  passport.authenticate("linkedin", { failureRedirect: "/auth/linkedin/login" }),
  function (req, res) {
    const loader = multer({ dest: `public/uploads/${req.user.id}/` });
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));
app.get('/auth/github/token', 
  passport.authenticate('github', { failureRedirect: '/auth/github/login' }),
  function(req, res) {
    const loader = multer({ dest: `public/uploads/${req.user.id}/` });
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get("/", function (req, res) {
 
  res.render("front", { currentUser: req.user});
});
app.get("/templates", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to that page"); 
   res.redirect("/login");
  }
  else res.render("availabletemplates", { currentUser: req.user,success:req.flash('info'),danger:req.flash('error') });
});
app.get("/home", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    res.redirect("/login");
  }
  else res.render("home", { currentUser: req.user,success:req.flash('info'),danger:req.flash('error') });
});
app.get("/login", function (req, res) {
  
  res.render("login",{success:req.flash('info'),danger:req.flash('error')});
   
});
app.get("/register", function (req, res) {
  res.render("signup",{success:req.flash('info'),danger:req.flash('error')});
});
app.get("/logout", function (req, res) {
 
  req.logout();
  res.redirect("/");
});
let templateno = 1;
app.get("/download", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
  Project.find({ _id: req.user.id }, function (err, posts) {
    if (!err) {
      res.render("template" + templateno, { found: posts });
    }
  });
});
app.get("/forget", function (req, res) {
 
      res.render("forget",{success:req.flash('info'),danger:req.flash('error')});
   
});


app.get("/:customName", function (req, res) {
  let customListName = req.params.customName;
  // const loader = multer({ dest: `public/uploads/${req.user.id}/` });
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
 
  Project.find({ _id: req.user.id }, function (err, found) {
    if (!err) {
      res.render(customListName, {
        current: customListName,
        found: found,
        success:req.flash('info'),danger:req.flash('error')
       
      });
    }
  });
});
app.get('/reset/:token', function(req, res) {
  
  Project.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      // console.log("failed");
      return res.redirect('/forget');
    }
    res.render('newpassword', {found: user,success:req.flash('info'),danger:req.flash('error')});
  });
});
app.post("/templates", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
  templateno = req.body.template;
  res.redirect("/profile");
});
app.post("/login", function (req, res) {
  const user = new Project({
    username: req.body.username,
    password: req.body.password,
  });
  
        passport.authenticate('local', function(err, user) {
           if (err) 
           { 
            req.flash('error',err.message); 
            return  res.redirect("/login");
            }
           if (!user) 
            {  
              req.flash('error',"Invalid credentials"); 
              return res.redirect("/login");
            }
          req.logIn(user, function(err) {
           if (err) 
         {  
           req.flash('error',err.message); 
           return res.redirect("/login");
         }
            const loader = multer({ dest: `public/uploads/${req.user.id}/` });
         return res.redirect('/');
       });
       })(req, res);
     
    });
 
app.post("/register", function (req, res) {
  let value=req.body.password;
  let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
if(!value.match(passw)) 
{ 
  req.flash('error',"Password must be atleast 6 characters long , contains atleast one numeric digit, one uppercase & one lowercase letter."); 
    return res.redirect("/register");
}
  Project.register(
    { username: req.body.username,loginid:req.body.emailid },
    req.body.password,
    function (err, user) {
      if (err) {
        req.flash('error',"A user with the given username or email is already registered ");
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          const loader = multer({ dest: `public/uploads/${req.user.id}/` });
          res.redirect("/");
        });
      }
    }
  );
});


app.post("/profile", function (req, res) {
  // console.log(req.body);

  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }


  var myquery = { _id: req.user.id };
  var newvalues = {
    $set: {
      firstname: req.body.firstname,
      profile: req.body.profile,
      email: req.body.email,
      pno: req.body.pno,
      website: req.body.website,
      github: req.body.github,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      pin: req.body.pin,
      address: req.body.address,
      currentposition: req.body.currentposition,
    },
  };
  Project.updateMany(myquery, newvalues, function (err, res) {
    if (!err) 
    {console.log("Documents updated successfully");}
  });

  if(req.body.btn=="1")
  {
  Project.updateOne(myquery, { $set: {visitedProfile:1} }, function (err, res) {
    if (!err) 
    {console.log("Setted visitedprofile from 0 to 1");}
  });
  }

  res.redirect("/education");
});





app.post("/education", function (req, res) {



  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
 let value = req.body.btn;
  
 var myquery = { _id: req.user.id };
  if (value === "1") {
    Project.updateOne(myquery, { $inc: { noOfeducation:1} }, function (err, res) {
      if (!err) console.log("Education incremented successfully");
    });

  } else {
    if (value === "2") {
      Project.updateOne(myquery, { $inc: { noOfeducation:-1} }, function (err, res) {
      if (!err) console.log("Education decremented successfully");
    });
    }
  }



  Project.updateOne(myquery, { $set: { school: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      school: {
        name: req.body.name,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        degree: req.body.degree,
        gpa: req.body.gpa,
        location: req.body.location,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });




  if (value === "3") {
    Project.updateOne(myquery, { $set: {visitedEducation:1} }, function (err, res) {
      if (!err) 
      {console.log("Setted visitedEducation from 0 to 1");}
    });
    res.redirect("/skills");
  } else {
    res.redirect("/education");
  }
});




app.post("/work", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
let value = req.body.btn;
 
  var myquery = { _id: req.user.id };
  if (value === "1") {
   
    Project.updateOne(myquery, { $inc: { noOfWorkExperience:1} }, function (err, res) {
      if (!err) console.log("Work incremented successfully");
    });

  } 
  else 
  {
    if (value === "2") {

        Project.updateOne(myquery, { $inc: { noOfWorkExperience:-1} }, function (err, res) {
          if (!err) console.log("Work decremented successfully");
        });
       }
  }
  
  


  Project.updateOne(myquery, { $set: { work: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });





  var newvalue = {
    $push: {
      work: {
        companyname: req.body.companyname,
        jobtitle: req.body.jobtitle,
        state: req.body.state,
        city: req.body.city,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        jobdescription: req.body.jobdescription,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });





  if (value === "3") {
    res.redirect("/projects");
  } else {
    res.redirect("/work");
  }
});





app.post("/skills", function (req, res) {
  console.log(req.body);
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
let value = req.body.btn;
   var myquery = { _id: req.user.id };
  
  if (value === "1") {
    Project.updateOne(myquery, { $inc: { noOfSkills:1} }, function (err, res) {
      if (!err) console.log("Skills incremented successfully");
    });

  } else if (value === "2") {
    Project.updateOne(myquery, { $inc: { noOfSkills:-1} }, function (err, res) {
      if (!err) console.log("Skills decremented successfully");
    });
  }

  
  Project.updateOne(myquery, { $set: { skills: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });
  var newvalue = {
    $push: {
      skills: {
        skillsname: req.body.skillsname,
        skillsdetails: req.body.skillsdetails,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });
 
  if (value === "3") {
    Project.updateOne(myquery, { $set: {visitedSkills:1} }, function (err, res) {
      if (!err) 
      {console.log("Setted visitedSkills from 0 to 1");}
    });
    res.redirect("/work");
  } else {
    res.redirect("/skills");
  }
});
app.post("/projects", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
let value = req.body.btn;
  
   var myquery = { _id: req.user.id };
  if (value === "1") {
    Project.updateOne(myquery, { $inc: { noOfProjects:1} }, function (err, res) {
      if (!err) console.log("Projects incremented successfully");
    });

  } else {
    if (value === "2") {
      Project.updateOne(myquery, { $inc: { noOfProjects:-1} }, function (err, res) {
        if (!err) console.log("Projects decremented successfully");
      });
    }
  }
 
 
  Project.updateOne(myquery, { $set: { project: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });
  var newvalue = {
    $push: {
      project: {
        projectname: req.body.projectname,
        project1description: req.body.project1description,
        link: req.body.link,
        toolsused: req.body.toolsused,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });
  
  if (value === "3") {
    res.redirect("/awards");
  } else {
    res.redirect("/projects");
  }
});
app.post("/awards", function (req, res) {
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
let value = req.body.btn; 
var myquery = { _id: req.user.id };
 
  
  if (value === "1") {
    Project.updateOne(myquery, { $inc: { noOfAwards:1} }, function (err, res) {
      if (!err) console.log("Awards incremented successfully");
    });

  } else {
    if (value === "2") {
      Project.updateOne(myquery, { $inc: { noOfAwards:-1} }, function (err, res) {
        if (!err) console.log("Awards decremented successfully");
      });
    }
  }

 
  let arr = req.body.awardname;
  Project.updateOne(myquery, { $set: { awards: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });
  var newvalue = {
    $push: {
      awards: {
        awardname: req.body.awardname,
        awarddate: req.body.awarddate,
        awarder: req.body.awarder,
        Awarddescription: req.body.Awarddescription,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
   
  });
  
  if (value === "3") {
    res.redirect("/personal");
  } else {
    res.redirect("/awards");
  }
});
let flag=1;
let flag1=0;
let count=0;

app.post("/personal", upload.single("photo"), function (req, res) {
  
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }

  try{

    let buttonvalue=req.body.btnn;
    if(buttonvalue!=1)
    {
     
      flag=0;
      fs.readdir(`./public/uploads/${req.user.id}/`, (err, files) => {
        if (err) {
          console.log(err); 
        }
    
        files.forEach((file) => {
          const fileDir = path.join(`./public/uploads/${req.user.id}/`, file);
            fs.unlinkSync(fileDir);
        });
      });
      var query = { _id: req.user.id };
  var values = {
    $set: {
      img: null,
      filepresentornot:0
    },
  };
  Project.updateOne(query, values, function (err, res) {
    if (!err) console.log("Document updated successfully");
  });
  
  
      return res.redirect("/personal")
        //  console.log("uploaded");
    }
   
  let imagefile = req.file.originalname;
  //  console.log(req.file);
  //  console.log(imagefile);
  //  console.log(req.body);
  
  var myquery = { _id: req.user.id };
  var newvalues = {
    $set: {
      img: imagefile,
    },
  };
  Project.updateOne(myquery, newvalues, function (err, res) {
    if (!err) console.log("Document updated successfully"); 
  });
  filepresentornot = 1;
  Project.updateOne(myquery, { $set: {filepresentornot:filepresentornot} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");  
  });
  
  fs.readdir(`./public/uploads/${req.user.id}/`, (err, files) => {
    if (err) {
      console.log(err); 
    }
    files.forEach((file) => {
      const fileDir = path.join(`./public/uploads/${req.user.id}/`, file);
      if (file !== imagefile) {
        fs.unlinkSync(fileDir);
      }
    });
  });
}catch(err)
{
  req.flash('error',"First you have to choose file then you can upload it");
  return res.redirect("/personal")
}

  res.redirect("/personal");
});
app.post("/extra", function (req, res) {
  // console.log(req.body);
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
  var myquery = { _id: req.user.id };

  if (req.body.btn === "1") {
    Project.updateOne(myquery, { $inc: { noOfhobbies:1} }, function (err, res) {
      if (!err) console.log("Hobbie incremented successfully");
    });
  } else if (req.body.btn === "2") {
    Project.updateOne(myquery, { $inc: { noOfhobbies:-1} }, function (err, res) {
      if (!err) console.log("Hobbie decremented successfully");
    });
  } else if (req.body.btn === "3") {
    Project.updateOne(myquery, { $inc: { noOfStrengths:1} }, function (err, res) {
      if (!err) console.log("Strength incremented successfully");
    });
  } else if (req.body.btn === "4") {
    Project.updateOne(myquery, { $inc: { noOfStrengths:-1} }, function (err, res) {
      if (!err) console.log("Strength decremented successfully");
    });
  } else if (req.body.btn === "5") {
    Project.updateOne(myquery, { $inc: { noOfLanguage:1} }, function (err, res) {
      if (!err) console.log("Language incremented successfully");
    });
  } else if (req.body.btn === "6") {
    Project.updateOne(myquery, { $inc: { noOfLanguage:-1} }, function (err, res) {
      if (!err) console.log("Language decremented successfully");
    });
  } else if (req.body.btn === "7") {
    Project.updateOne(myquery, { $inc: { noOfGoals:1} }, function (err, res) {
      if (!err) console.log("Goals incremented successfully");
    });
  } else if (req.body.btn === "8") {
    Project.updateOne(myquery, { $inc: { noOfGoals:-1} }, function (err, res) {
      if (!err) console.log("Goals decremented successfully");
    });
  }
  
 
  Project.updateOne(myquery, { $set: { extra: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
   
  });
  var newvalue = {
    $push: {
      extra: {
        hobbie: req.body.hobbie,
        strength: req.body.strength,
        language: req.body.language,
        goals: req.body.goal,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
   
  });

  if(req.body.btn==="9")
  res.redirect("/download");
  else
  res.redirect("/extra");
});
app.post("/",function(req,res){
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
 
let value=req.body.btn;
  if(value==="1"){
    var myquery = { _id: req.user.id };
    Project.updateMany(myquery, { $set: 
      { 
        
        school:[],work:[],skills:[],project:[],awards:[],extra:[],
        img:null,currentposition:null,address:null,pin:null,
        city:null,state:null,country:null,twitter:null,linkedin:null,github:null,
        website:null,pno:null,email:null,profile:null,firstname:null,
        filepresentornot: 0,count: 1,noOfProjects:1,noOfSkills:1,
        noOfWorkExperience:1,noOfAwards:1,noOfhobbies:1,
        noOfStrengths:1,noOfLanguage:1,noOfGoals:1,noOfeducation:1,
        visitedProfile:0,visitedEducation:0,visitedSkills:0,
      
      } 
    
    
    }, function (err, res) {
      if (!err) console.log(" All Documents deleted successfully");
     
    });

  }
  
  if(value==="3")
  {
    res.redirect("/templates");
  }
  else if(value==="2")
  {
    res.redirect("/templates")
  }
  else{
  res.redirect("/home")
  }
})
app.post("/home",function(req,res)
{
  if (!req.user) 
  {
    req.flash('error',"User is not authenticated ! You have to first login to get access to the page"); 
    return res.redirect("/login");
  }
  res.render("availabletemplates", { currentUser: req.user,success:req.flash('info'),danger:req.flash('error') });
})
app.post('/forget', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Project.findOne({ loginid: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
         return  res.redirect('/forget');
        }
        if(err)
        {
          req.flash('error',err.message);
          return  res.redirect('/forget');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: req.body.email,
        from: 'passwordreset@demo.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
     if (err)
       // return next(err);
       req.flash('error',err.message); 
    res.redirect('/forget');
  });
});
app.post('/reset/:token', function(req, res) {
  let loc=`/reset/${req.params.token}`;
  if(req.body.password===req.body.confirm){
  async.waterfall([
    function(done) {
      Project.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forget');
        }
        let value=req.body.password;
  let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
if(!value.match(passw)) 
{ 
  req.flash('error',"Password must be atleast 6 characters long , contains atleast one numeric digit, one uppercase & one lowercase letter."); 
    return res.redirect(loc);
}
        Project.findByUsername(user.username).then(function(sanitizedUser){
          if (sanitizedUser){
              sanitizedUser.setPassword(req.body.password, function(){
                  sanitizedUser.save();
                //  console.log("password reset successful'");
              });
          } else {
            // console.log('This user does not exist');
            req.flash('error', "User does not exist!");
            return res.redirect('/forget');
          }
      },function(err){
          // console.log(err);
          if(err)
          req.flash('error',"Error occured! Please contact developer"); 
      })
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD
        }
      });
      var mailOptions = {
        to:user.loginid,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.loginid + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'Your password has been successfully changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/login');
    if(err)
    req.flash('error',err.message); 
  });
}
else{
  req.flash('error',"Password don't match"); 
 
  res.redirect(loc)
}
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server has been started");
});