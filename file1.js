const express = require('express');
const app = express();
const port = 3000;

// Route to display group names
app.get('/', (req, res) => {
    res.send('Group Members: Manjot Kaur,Diksha Diksha, Mohit kumar');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
