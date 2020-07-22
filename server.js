const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors =  require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image= require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
});

const app = express();
const saltRounds=10;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {res.send('it is working!')})
app.post('/signin', (req,res) => { signin.handleSignin(req,res,db,bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req , res, db, bcrypt, saltRounds)})
app.get('/profile/:id', (req,res) => {profile.handleProfile(req,res,db)})
app.put('/image', (req,res) => {image.handleImage(req,res,db)})
app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)})

app.listen(3000, () => {
	console.log('app is running on port 3000');
})