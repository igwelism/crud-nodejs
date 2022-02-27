import { projectSchema } from '../models/projectModel'
const mongodb = require('mongodb')
const dbConnection = mongodb.MongoClient
const Joi = require('joi')

// mongodb connection
let db
let connectionString = `mongodb://localhost:27017/todolist`

dbConnection.connect(
    connectionString,
    {useNewUrlParser:true, useUnifiedTopology: true},
    function(err, client) {
        if(err) {
            console.log("Connection failed for some reason")
        }
        db = client.db()
    }
)

export const addNewProject = (req, res) => {
    const result = Joi.validate(req.body, projectSchema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    // Sending request to create a project
    db.collection('projects').insertOne(req.body, function(err, result) {
        if(err) {
            res.status(400).send("Error Inserting Project")
        } else {
            db.collection('projects').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"projects":result})
            })
        }
    })
}

export const getProjects = (req, res) => {
    // Sending request to retrieve all projects
    switch (Object.keys(req.query).toString()) {
        case 'name':
            const regex = new RegExp(req.query.name, "i");
            var query = {name: regex}
            break;
        case 'start_date':
            if(req.query.start_date == 'asc') {
                var sort = {"start_date": 1}
            } else {
                var sort = {"start_date": -1}
            }
            break;
        case 'end_date':
            if(req.query.end_date == 'asc') {
                var sort = {"end_date": 1}
            } else {
                var sort = {"end_date": -1}
            }
            break;
        default:
            var query = req.query
            var sort = {"start_date": -1}
      }
    db.collection('projects').find(query).sort(sort).toArray(function(err, result) {
        if(err) {
            res.status(400).send("Error Getting Projects")
        } else {
            res.json({"projects":result})
        }
    })
}

export const updateProject = (req, res) => {
    const result = Joi.validate(req.body, projectSchema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    // Sending request to update a project
    db.collection('projects').updateOne({'_id': new mongodb.ObjectId(req.params.projectID)}, {$set: req.body}, function(err, result) {
        if(result.matchedCount == 0 ) {
            res.status(400).send("Project Not Found")
        } else {
            db.collection('projects').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"projects":result})
            })
        }
    })
}

export const deleteProject = (req, res) => {
    // Sending request to delete a project
    db.collection('projects').deleteOne({'_id': new mongodb.ObjectId(req.params.projectID)}, function(err, result) {
        if(err) {
            res.status(400).send("Error Deleting a Task")
        } else {
            db.collection('projects').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"projects":result})
            })
        }
    })
}

export const assignToProdject = (req, res) => {
    // Sending request to assing tasks to a project
    var tasks = req.body.taskIds
    for (let i = 0; i < tasks.length; i++) {
        // Sending request to update task
        db.collection('tasks').updateOne({'_id': new mongodb.ObjectId(tasks[i])}, {$set: {product_id: req.params.projectID}}, function(err, result) {
            if(err) {
                res.status(400).send("Error Updating Tasks")
            } else {
                console.log(`Task ${tasks[i]} has been update successfully`)
            }
        })
    }
    db.collection('tasks').find({product_id: req.params.projectID}).toArray(function(err, result) {
        if(err) {
            res.status(400).send("Error Getting Tasks")
        }
        db.collection('projects').find({'_id': new mongodb.ObjectId(req.params.projectID)}).toArray(function(err, project) {
            if(project.length == 0) {
                res.status(400).send("Project Not Found")
            }
            project[0].tasks = result
            res.json(project)
        })
    })
}

export const getAProdject = (req, res) => {
    // Sending request to get a project
    db.collection('tasks').find({product_id: req.params.projectID}).toArray(function(err, result) {
        if(err) {
            res.status(400).send("Error Getting Tasks")
        }
        db.collection('projects').find({'_id': new mongodb.ObjectId(req.params.projectID)}).toArray(function(err, project) {
            if(err) {
                res.status(400).send("Error Getting Project")
            }
            project[0].tasks = result
            res.json(project)
        })
    })
}