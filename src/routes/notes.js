const express = require('express');
const router = express.Router(); // Enrutador 

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});
//Alta de Notas
router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Porfavor escriba el titulo' });
    }
    if (!description) {
        errors.push({ text: 'Porfavor escriba la descripcion' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {

        const newNote = new Note({ title, description });
        newNote.user = req.user.id; //Agrega el id del usuario para la nota
        await newNote.save();
        req.flash('success_msg', 'Nota agregada correctamente');
        res.redirect('/notes');

    }

});
router.get('/notes', isAuthenticated, async(req, res) => {
    const notes = await Note.find({ user: req.user.id }); // el parametro entre {} es el id del usuario que se relaciono la nota
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', { note });
});

// Modificacion de las notas
router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Nota Modificada Correctamente');
    res.redirect('/notes');
});

//Eliminacion de notas

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota Eliminada Correctamente');
    res.redirect('/notes');
});

module.exports = router;