const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/tasks', auth,  async(req, res) => {

    const task = new Task({

        ...req.body,
        createdBy: req.user._id,
    });
    //req.user.tasks = req.user.tasks.concat({task:task._id});
    //console.log(req.user);
    try{
        await task.save();
        await req.user.save();
        //console.log(task._id);
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
});


//GET// ?completed = true/false
router.get('/tasks', auth,  async (req, res) => {

    let match;
    //const sort = {};

    
    if(req.query.completed){
        
        match = req.query.completed === 'true';
        try{
            const tasks = await Task.find({createdBy: req.user._id},
                null, {limit: parseInt(req.query.limit), skip: parseInt(req.query.skip), sort: {createdAt: req.query.sortByTime}});         
                if(!tasks){
                res.status(404).send();
            }
            res.send(tasks);
        }catch(e){
            res.status(500).json(e.message)

        }
    }
    else{

        try{
            const tasks = await Task.find({createdBy: req.user._id},
                 null, {limit: parseInt(req.query.limit), skip: parseInt(req.query.skip), sort: {createdAt: req.query.sortByTime}});
            
                 if(!tasks){
                res.status(404).send();
            }
           
            res.send(tasks);
        }catch(e){
            res.status(500).json(e.message)
    
        }
    }   
});

router.get('/tasks/:id', auth,  async(req, res) => {

    const taskId = req.params.id
    try{
        const task = await Task.findOne({_id: taskId, createdBy: req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.send(e.message);
    }
});



router.patch('/tasks/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body);
    const allowdUpdate = ['description', 'completed'];
    const isValidupdate = updates.every((update) => allowdUpdate.includes(update));

    if(!isValidupdate){
        return res.status(400).send("error: invalid updates");

    }
    
    try{

        const task = await Task.findOne({_id: req.params.id, createdBy: req.user._id});
        if(!task){
            res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.send(task);
    }catch(e){

    }
});


router.delete('/tasks/:id', auth, async (req, res) => {

    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, createdBy: req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task)
    }catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;


// refresh token, hard delete vs soft delete and its benifits, helmet


//docs of lookup