/**
 * @author Marc Adrian Dominguez
 * @studentID 301151879
 * @description Personal Portfolio
 */

// modules required for routing
let express = require('express');
let nodemailer = require('nodemailer');
let config = require('config');

let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET about page. */
router.get('/about', (req, res, next) => {
    res.render('index', {
        title: 'About',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET products page. */
router.get('/projects', (req, res, next) => {
    res.render('index', {
        title: 'Projects',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET services page. */
router.get('/services', (req, res, next) => {
    res.render('index', {
        title: 'Services',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
    res.render('index', {
        title: 'Contact',
        displayName: req.user ? req.user.displayName : '',
        messageSent: false
    });
});


// POST contact handler
router.post('/contact', (req, res, next) => {
    let mailOptions;
    let smtpTransport;

    // Setting up Nodemailer transport
    smtpTransport = nodemailer.createTransport({
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: config.get("email"),
            pass: config.get("password")
        }
    });

    // Setting up mail options
    mailOptions = {
        from: `${req.body.first_name} ${req.body.last_name} <${req.body.email}>`,
        to: config.get("email"),
        subject: 'Portfolio contact me form',
        text: `${req.body.message}\n Sent by: ${req.body.first_name} ${req.body.last_name} <${req.body.email}>`
    };

    // Sending email
    smtpTransport.sendMail(mailOptions, (error, response) => {
        // Email not sent case
        if (error) {
            res.render('index', {
                title: 'Contact',
                displayName: req.user ? req.user.displayName : '',
                messageSent: true,
                error: true
            })
        }
        // Email sent
        else {
            res.render('index', {
                title: 'Contact',
                displayName: req.user ? req.user.displayName : '',
                messageSent: true,
                error: false
            })
        }
    });
});

//------------------------------------AUTHORIZATION ROUTES------------------------------------
let passport = require('passport');

// defining the user model
let User = require('../models/users');

// GET login request
router.get('/login', (req, res, next) => {
    // check to see if the user is not already logged in
    if (!req.user) {
        // render the login page
        res.render('auth/login', {
            title: "Login",
            businessContacts: {},
            messages: req.flash('loginErrorMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    } else {
        return res.redirect('/businessContacts');
    }
});

// POST login request
router.post('/login', passport.authenticate('local', {
    successRedirect: '/businessContacts',
    failureRedirect: '/login',
    failureFlash: {type: 'loginErrorMessage', message: 'Invalid username or password.'}
}));

// GET register request
router.get('/register', (req, res, next) => {
    // check to see if the user is not already logged in
    if (!req.user) {
        // render the registration page
        res.render('auth/register', {
            title: "Register",
            businessContacts: {},
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    } else {
        return res.redirect('/businessContacts');
    }
});

// POST register request
router.post('/register', (req, res, next) => {
    User.register(
        new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            displayName: req.body.displayName
        }),
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error inserting new user');
                if (err.name == "UserExistsError") {
                    req.flash('registerMessage', 'Registration Error: User Already Exists');
                }
                return res.render('auth/register', {
                    title: "Register",
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
            }
            // if registration is successful
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/businessContacts');
            });
        });
});

// GET logout request
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
