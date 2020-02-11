const express = require('express');
const router = express.Router(); // Enrutador 
const User = require('../models/Users');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async(req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Ingresa el Nombre' });
    }
    if (email.length <= 0) {
        errors.push({ text: 'Ingresa el Email' });
    }
    if (password.length <= 0) {
        errors.push({ text: 'Ingresa la primera contraseña' });
    }
    if (confirm_password.length <= 0) {
        errors.push({ text: 'Ingresa la confirmacion de la contraseña' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'La Contraseña no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Debe escribir una contraseña con minimo 4 caracteres' });

    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });

    } else {

        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('success_msg', 'El email ya esta en uso ingrese otro distinto');
            res.redirect('/users/signup');
        }
        //Guardado en la base de datos el registro del Usuario 
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Ya se Registro');
        res.redirect('/users/signin');

    }

});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
module.exports = router;