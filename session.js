const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;


app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


const users = [];


app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  
  users.push({ username, password });

  res.status(200).send('Signup successful!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

 
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
  
    req.session.user = username;

    res.status(200).send('Login successful!');
  } else {
    res.status(401).send('Invalid credentials');
  }
});


app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.status(200).send(`Welcome to the dashboard, ${req.session.user}!`);
  } else {
    res.status(401).send('Unauthorized - Please login');
  }
});


app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Error during logout');
    } else {
      res.status(200).send('Logout successful');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
