const crypto = require('crypto');
const User = require('../../models/User');

// GLOBAL VARS
const passwordMin = 6;
const saltLength = 20;

// IMPORTANT FUNCTIONS

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
}

function sha512(password, length) {
    let salt = genRandomString(length);
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

// REGISTER

function registerNewUser(req, res, username, email, emailConfirm, password, passwordConfirm) {
    let errors = [];

    if(!username || !email || !emailConfirm || !password || !passwordConfirm) {
        errors.push({
            msg: 'Bitte alle Felder ausfüllen'
        });
    }

    if(password !== passwordConfirm) {
        errors.push({
            msg: 'Passwörter stimmen nicht überein'
        });
    }

    if (password.length < passwordMin) {
        errors.push({
            msg: 'Passwort muss mindestens ' + passwordMin + ' Zeichen lang sein.'
        })
    }

    if (User.findOne( { email: email } ). then(user => {
        if (user) {
            //User with email already exists
            error.push({
                msg: 'Email is already registered'
            });
        }
    }))

    if (User.findOne({name: username}).then(user => {
        if (user) {
            //User with username already exists
            error.push({
                msg: 'Username is already in use'
            });
        }
    }))

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            emailConfirm,
            password,
            passwordConfirm
        });
    }

    let { salt, hash} = sha512(password, saltLength);

    const newUser = new User({
        name: username,
        email: email,
        password: hash,
        salt: salt
    });
    newUser.save()
        .then(user => {
            req.flash('success_msg', 'Du bist nun registriert und kannst dich einloggen');
            res.redirect('/users/login');
        });

}

module.exports.register = registerNewUser;

// LOGIN

function loginUser(req, res, username, password) {
    User.findOne({ name: username }).then(user => {
        let errors = [];
        if (!user) {
            // No user with username found!
            errors.push({
                msg: 'Username not found'
            });
            res.render('login', {
                errors,
                username,
                password
            });
        }
        else {
            // User found
            let hash = sha512(password, user.salt);
            if (hash !== user.password) {
                // Wrong password
                errors.push({
                    msg: 'Wrong password'
                });
                res.render('login', {
                    errors,
                    username,
                    password
                });
            }
            else {
                res.redirect('/game');
            }
        }
    })
}

module.exports.login = loginUser;

// LOGOUT

function logoutUser() {

}

module.exports.logout = logoutUser;