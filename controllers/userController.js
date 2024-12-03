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



module.exports = { 
    getUserById
}