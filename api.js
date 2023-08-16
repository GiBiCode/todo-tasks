var mongoose = require("mongoose");
var TaskModel = require('./task_schema');
var express = require("express");
var router = express.Router();

let environment = null;

if (!process.env.ON_HEROKU) {
    console.log("Cargando variables de entorno desde archivo");
    const env = require('node-env-file');
    env(__dirname + '/.env');
}

environment = {
    DBMONGOUSER: process.env.DBMONGOUSER,
    DBMONGOPASS: process.env.DBMONGOPASS,
    DBMONGOSERV: process.env.DBMONGOSERV,
    DBMONGO: process.env.DBMONGO,
};

var query = 'mongodb+srv://' + environment.DBMONGOUSER + ':' + environment.DBMONGOPASS + '@' + environment.DBMONGOSERV + '/' + environment.DBMONGO + '?retryWrites=true&w=majority';

const db = (query);

mongoose.Promise = global.Promise;

(async function() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Se ha conectado con la base de datos exitosamente");
  } catch (error) {
    console.error("Error de conexión:", error);
  }
})(); 

//Crear Tarea
    router.post('/create-task', async function (req, res) {
    let task_id = req.body.TaskId;
    let name = req.body.Name;
    let deadline = req.body.Deadline;

    let task = {
        TaskId: task_id,
        Name: name,
        Deadline: deadline
    }

    try {
        var newTask = new TaskModel(task);
        await newTask.save();
        res.status(200).send("Ok\n");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal error\n");
    }
}); 

//Consultar Tarea
router.get('/all-tasks', async (req, res) => {
    try {
        const data = await TaskModel.find();
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send("Internal error\n");
    }
});


//Actualizar Tarea
router.post('/update-task', async function (req, res) {
    try {
        await TaskModel.updateOne(
            { TaskId: req.body.TaskId },
            { Name: req.body.Name, Deadline: req.body.Deadline }
        );
        res.status(200).send("OK\n");
    } catch (err) {
        res.status(500).send("Internal error\n");
    }
});

//Eliminar Tarea
router.delete('/delete-task', async function (req, res) {
    try {
        await TaskModel.deleteOne({ TaskId: req.body.TaskId });
        res.status(200).send("OK\n");
    } catch (err) {
        res.status(500).send("Internal error\n");
    }
});

module.exports = router;

