const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
    const trySchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model('Task', trySchema);

// Default Items
const defaultItems = [
    { name: 'Create a todo list' },
    { name: 'Learn DSA' },
    { name: 'Learn React' },
    { name: 'Take a break' }
];

// GET Route
app.get('/', async (req, res) => {
    try {
        const foundItems = await Item.find({});
        if (foundItems.length === 0) {
            await Item.insertMany(defaultItems);
            console.log('Default items added successfully.');
            return res.redirect('/');
        }
        console.log('Rendering tasks:', foundItems.length);
        res.render('List', { ejes: foundItems });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('An error occurred.');
    }
});

// POST Route (Add Task)
app.post('/', async (req, res) => {
    try {
        const newTask = new Item({
            name: req.body.taskR
        });
        await newTask.save();
        console.log('Task added:', newTask.name);
        res.redirect('/');
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).send('An error occurred while adding the task.');
    }
});

// DELETE Route
app.post('/delete', async (req, res) => {
    try {
        console.log('Delete request body:', req.body);
        const taskId = req.body.taskId || req.body.checkbox;
        if (!taskId) {
            console.log('No task ID provided.');
            return res.redirect('/');
        }
        await Item.findByIdAndDelete(taskId);
        console.log('Task deleted successfully:', taskId);
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('An error occurred while deleting the task.');
    }
});

// Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});