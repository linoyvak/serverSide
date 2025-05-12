import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import initApp from "./server";

const port = 3004; 
const app = express();


app.use(express.static('public'));

initApp().then((app) => {
    app.listen(port, () => {
        console.log(` Server running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error(" Failed to initialize app:", error);
});  