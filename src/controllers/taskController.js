import { taskSchema } from '../models/taskModel'
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

export const addNewTask = (req, res) => {
    const result = Joi.validate(req.body, taskSchema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    // Sending request to create a task
    db.collection('tasks').insertOne(req.body, function(err, result) {
        if(err) {
            res.status(400).send("Error Inserting Task")
        } else {
            db.collection('tasks').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"tasks":result})
            })
        }
    })
}

export const getTasks = (req, res) => {
    // Sending request to retrieve all tasks
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
        case 'done_date':
            if(req.query.due_date == 'asc') {
                var sort = {"done_date": 1}
            } else {
                var sort = {"done_date": -1}
            }
            break;
        default:
            var query = req.query
            var sort = {"start_date": -1}
      }
    console.log(sort)
    db.collection('tasks').find(query).sort(sort).toArray(function(err, result) {
        if(err) {
            res.status(400).send("Error Getting Tasks")
        } else {
            res.json({"tasks":result})
        }
    })
}

export const updateTask = (req, res) => {
    const result = Joi.validate(req.body, taskSchema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    // Sending request to update a task
    if(req.body.status == 'done') {
        const dateObj = new Date();
        req.body.done_date = `${String(dateObj.getMonth()).padStart(2,'0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`
    }
    db.collection('tasks').updateOne({'_id': new mongodb.ObjectId(req.params.taskID)}, {$set: req.body}, function(err, result) {
        if(result.matchedCount == 0 ) {
            res.status(400).send("Task Not Found")
        } else {
            db.collection('tasks').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"tasks":result})
            })
        }
    })
}

export const deleteTask = (req, res) => {
    // Sending request to delete a task
    db.collection('tasks').deleteOne({'_id': new mongodb.ObjectId(req.params.taskID)}, function(err, result) {
        if(err) {
            res.status(400).send("Error Deleting a Task")
        } else {
            db.collection('tasks').find({}).sort({"start_date": -1}).toArray(function(err, result) {
                res.json({"tasks":result})
            })
        }
    })
}