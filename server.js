const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors =  require('cors');
const knex = require('knex')

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
const database = {
	users: [
	{
		id:'134',
		name:'john',
		email:'john@gmail.com',
		password: 'cookies',
		entries: 0,
		joined: new Date()
	},
	{
		id:'123',
		name:'sally',
		email:'sally@gmail.com',
		password: 'biscuit',
		entries: 0,
		joined: new Date()
	}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=' , req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('unable to get user'));
			}
			else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch(err => res.status(400).json('wrong credentials'));
})

app.post('/register',(req,res) => {
	const { email, name, password} = req.body;
	const hash = bcrypt.hashSync(password, saltRounds);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				}).then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		
		.catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	db.select('*').from('users').where({
		id:id
	}).then(user => {
		if(user.length) {
		res.json(user[0]);
	}
	else {
		res.status(404).json('user not found');
	}
	})
})

app.put('/image', (req,res) => {
	const {id} = req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'));

})


/*
 // true*/

app.listen(3000, () => {
	console.log('app is running on port 3000');
})