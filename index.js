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
const { json } = require('express');

const server = express();

server.use(express.json());

const PORT = 8000;

//Middleware

server.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

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

server.get('/api/projects', (req, res, next) => {
	Projects.get()
		.then((returned) => {
			res.json(returned);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Server failed to get projects' });
		});
});

server.put('/api/projects/:id', (req, res) => {
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
	//get all actions
	Actions.get()
		.then((returned) => {
			res.json(returned);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Server failed to get actions' });
		});
});

server.get('/api/projects/:id/actions', (req, res) => {
	//get actions for select project
	Projects.get(req.params.id)
		.then(() => {
			Actions.get()
				.then((arr) => {
					let selectActions = arr.filter(
						(item) => Number(item.project_id) === Number(req.params.id)
					);

					res.json(selectActions);
				})
				.catch((err) => {
					res
						.status(500)
						.json({ error: 'Server failed to get actions for project' });
				});
		})
		.catch((err) => {
			res.status(500).json({ error: 'Server failed to get project' });
		});
});

server.put('/api/actions/:id', (req, res) => {
	if (
		!req.body.project_id ||
		!req.body.description ||
		!req.body.notes ||
		req.body.completed === undefined
	) {
		res.status(400).json({
			message:
				'Required fields: project_id (int), description (string), notes (string), completed (bool)',
		});
	} else {
		Actions.get(req.params.id)
			.then(() => {
				Actions.update(req.params.id, {
					project_id: req.body.project_id,
					description: req.body.description,
					notes: req.body.notes,
					completed: req.body.completed,
				})
					.then((newAct) => {
						res.status(200).json(newAct);
					})
					.catch((err) => {
						res.status(500).json({ error: 'Server failed to update action' });
					});
			})
			.catch((err) => {
				res.status(500).json({ error: "Server couldn't find action" });
			});
	}
});

server.delete('/api/actions/:id', (req, res) => {
	Actions.get(req.params.id)
		.then(() => {
			Actions.remove(req.params.id)
				.then((returned) => {
					res.json(returned);
				})
				.catch((err) => {
					res.status(500).json({ error: 'Server failed to remove action' });
				});
		})
		.catch((err) => {
			res.status(500).json({ error: "Server couldn't find action" });
		});
});


//Starts server

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
