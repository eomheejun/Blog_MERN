const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const usersRoutes = require("./routes/api/users");
const profileRoutes = require("./routes/api/profile");
const postsRoutes = require("./routes/api/posts");

const app = express();

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);



//DB config
const db = require("./config/keys").mongoURI;

//connect to Mongo

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connectes..'))
    .catch(err => console.log(err));

    
//Use Routes
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);


const PORT = process.env.PORT || 3000;//따로지정하는 번호가 있으면 왼쪽


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));