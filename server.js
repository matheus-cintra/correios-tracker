const express = require('express');

const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
require('./api')(app);

app.use((req, res, next) => {
    res.status(404);
    return res.json({ message: 'Route not found' })
})

app.listen(3000, () => {
    console.warn('Running...');
})