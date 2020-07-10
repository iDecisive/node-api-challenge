/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just hack it…
I need this code, but don't know where, perhaps should make some middleware, don't worry, just hack it

Go code!
*/

const express = require('express');
const Projects = require('./data/helpers/projectModel');
const Actions = require('./data/helpers/actionModel');

const server = express();

server.use(express.json());

const PORT = 8000;

//CRUD operations on Projects

server.post('/api/projects', (req, res) => {
	if (!req.body.name || !req.body.description) {
		res.status(400).json({
			message: 'Needs following fields: name (string), description (string)',
		});
	} else {
		Projects.insert({
			name: req.body.name,
			description: req.body.description,
			completed: false,
		})
			.then((newPro) => {
				res.status(201).json(newPro);
			})
			.catch((err) => {
				res.status(500).json({ error: 'Server failed to create new project' });
			});
	}
});

server.get('/api/projects', (req, res) => {
	Projects.get()
		.then((returned) => {
			res.json(returned);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Server failed to get projects' });
		});
});

server.put('/api/projects/:id', (req, res) => {
	//add check to see if valid id

	if (
		!req.body.name ||
		!req.body.description ||
		req.body.completed === undefined
	) {
		res.status(400).json({
			message:
				'Required fields: name (string), description (string), completed (bool)',
		});
	} else {
		Projects.get(req.params.id)
			.then(() => {
				Projects.update(req.params.id, {
					name: req.body.name,
					description: req.body.description,
					completed: req.body.completed,
				})
					.then((newPro) => {
						res.status(200).json(newPro);
					})
					.catch((err) => {
						res.status(500).json({ error: 'Server failed to update project' });
					});
			})
			.catch((err) => {
				res.status(500).json({ error: "Server couldn't find project" });
			});
	}
});

server.delete('/api/projects/:id', (req, res) => {
	Projects.get(req.params.id)
		.then(() => {
			Projects.remove(req.params.id)
				.then((returned) => {
					res.json(returned);
				})
				.catch((err) => {
					res.status(500).json({ error: 'Server failed to remove project' });
				});
		})
		.catch((err) => {
			res.status(500).json({ error: "Server couldn't find project" });
		});
});

//Crud operations on actions

server.post('/api/actions', (req, res) => {
	//if none of that in req.body...

	if (!req.body.project_id || !req.body.description || !req.body.notes) {
		res.status(400).json({
			message:
				'Required fields: project_id (int), description (string), notes (string)',
		});
	} else {
		Actions.insert({
			project_id: req.body.project_id,
			description: req.body.description,
			notes: req.body.notes,
			completed: false,
		})
			.then((returned) => {
				res.status(201).json(returned);
			})
			.catch((err) => {
				res.status(500).json({ error: 'Server failed to create action' });
			});
	}
});

server.get('/api/actions', (req, res) => {
	Actions.get()
		.then((returned) => {
			res.json(returned);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Server failed to get actions' });
		});
});

//get all actions for project of this id?

//Starts server

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
