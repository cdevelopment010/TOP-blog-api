const db = require("../prisma/queries"); 

const getUserById = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    if (!userId) { 
        return res.sendStatus(404); 
    } 
    const user = await db.findUserById(userId); 
    res.sendStatus(200);
    console.log(user);
    return user; 
}

const createUser = async (req, res, next) => {
    const user = { 
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        admin: req.body.admin
    }

    try { 
        const created = await db.createUser(user); 
        res.sendStatus(200)
        return created;

    } catch(err) {
        console.error(err); 
        return next(err)
    }
}

const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try { 
        const deletedUser = await deleteUserById(userId); 
        res.sendStatus(200); 
        return true; 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const updateUser = async (req, res, next) => {
    const { userId } = req.params; 
    const user = { 
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        admin: req.body.admin, 
        id: userId
    }
    try { 
        const userUpdated = await db.updateUser(user);  
        return userUpdated; 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const addUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return user; 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const removeUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return user; 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

module.exports = { 
    getUserById, 
    createUser,
    deleteUser, 
    updateUser,
    addUserAdmin, 
    removeUserAdmin
}