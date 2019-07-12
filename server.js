const express = require("express");
const usersRoutes = require("./routes/api/users");
const profileRoutes = require("./routes/api/profile");
const postsRoutes = require("./routes/api/posts");

const app = express();

//Use Routes
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

const PORT = process.env.PORT || 3000;//따로지정하는 번호가 있으면 왼쪽


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));