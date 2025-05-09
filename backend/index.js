const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const EmployeeRoutes = require('./Routes/EmployeeRoutes');
const PORT = process.env.PORT || 8000;

require('./Models/db');
// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api/employee', EmployeeRoutes);
app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})