const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'fec298c2589743d0b0b810ce8b9d5336'
});
const handleApiCall = (req,res) => {
 app.models
 	.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
 	.then(data => {
 		res.json(data);
 	})
 	.catch(err => status(400).json('api call request failed'))
 }

const handleImage = (req,res, db) => {
	const {id} = req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'));

}

module.exports = {
	handleImage,
	handleApiCall
}