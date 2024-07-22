const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin')
admin.initializeApp()

const app = express();
app.use(cors({ origin: true }));
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


// api function
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.postLangtags = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(500).json({
			message: 'Not allowed'
		})
	}
	res.status(200).json({
		message: req.body
	})
})

exports.getLangtags = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(500).json({
			message: 'Not allowed'
		})
	}
	res.status(200).json({
		message: 'get langtags'
	})
})

exports.onFileChange = functions.storage.object().onFinalize(event => {
	console.log(event)
	const object = event.data
	const bucket = object.bucket
	const contentType = object.contentType
	const filePath = object.name
	console.log('File change detected, functipon exe ution started')
	return;
})

