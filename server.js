const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./server/config/mongoose.config');
require('./server/routes/user.routes')(app);
require('./server/routes/post.routes')(app);
require('./server/routes/follower.routes')(app);
require('dotenv').config({ debug: true })

app.listen(8000, () => {
    console.log("Listening at Port 8000")
})

