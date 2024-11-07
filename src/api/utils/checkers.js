import userModel from '../../integrations/postgres/models/userModel.js';

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
}

function isNotAuthenticated(req, res, next) {
    if (!req.session.username) {
        next();
    } else {
        res.redirect('/');
    }
}

async function isAdminAuthenticated(req, res, next) {
    if (req.session.username) {
        const user = await userModel.getById(req.session.user_id);
        if (user.is_admin){
            next();
        }else{
            req.session.destroy();
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

export default {isAuthenticated, isNotAuthenticated, isAdminAuthenticated};