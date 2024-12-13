const db = require("../prisma/queries"); 

const getUserById = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    if (!userId) { 
        return res.sendStatus(404); 
    } 
    const user = await db.findUserById(userId); 
    return res.status(200).json({
        success: true, 
        message: 'Get user successfully', 
        data: user
    });
}

const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try { 
        const deletedUser = await db.deleteUserById(userId); 
        return res.status(200).json({
            success: true, 
            message: 'User deleted successfully',
            data: deletedUser
        }); 
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
        return res.status(200).json({
            success: true, 
            message: 'User updated successfully',
            data: userUpdated
            }); 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const addUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return res.status(200).json({
            success: true, 
            message: 'User set as admin successfully',
            data: user
        }); 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const removeUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return res.status(200).json({
            success: true, 
            message: 'User removed as admin successfully',
            data: user
        });  
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

module.exports = { 
    getUserById, 
    deleteUser, 
    updateUser,
    addUserAdmin, 
    removeUserAdmin,
}