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

        res.status(400).json({ message: "Needs following fields: name (string), description (string)" });

    } else {

        Projects.insert({
            name: req.body.name,
            description: req.body.description,
            completed: false
        }).then(newPro => {
            res.status(201).json(newPro);
        }).catch(err => {
            res.status(500).json({ error: "Server failed to create new project" });
        })

        

    }

});

server.get('/api/projects', (req, res) => {

    Projects.get().then(returned => {
        res.json(returned);
    }).catch(err => {
        res.status(500).json({ error: "Server failed to get projects" });
    })

});

//Crud operations on actions

// Custom Middleware

let logger = (req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); 
	next();
};

server.use(logger);

//Starts server

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
}); 