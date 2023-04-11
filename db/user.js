const db = require('./index')
const bcrypt = require('bcrypt'); //used for encrypting passwords

const getAll = async () => {
    return await db
        .query('SELECT user_id, first_name, last_name, username FROM users ORDER BY user_id ASC')
        .then(response=>response.rows)
}

const getById = async id => {
    return await db
        .query(
            'SELECT user_id, first_name, last_name, username FROM users WHERE user_id = $1', 
            [id],
        )
        .then(response=>response.rows[0])
}

const getByUsername = async username => {
    return await db
        .query(
            'SELECT * FROM users WHERE username = $1', 
            [username],
        )
        .then(response=>response.rows[0])
}

const createUser = async (user) => {
    const {first_name, last_name, username, password} = user;
    // const hashedPassword = await bcrypt.hash(password, 10); //hash the password and store in variable
    return db
        .query(
            'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, 
            last_name, 
            username, 
            password]
        )
}

const updateUser = async (user, id) => {
    const {first_name, last_name, username, password} = user;
    const hashedPassword = await bcrypt.hash(password, 10); //hash the password and store in variable
    return await db
        .query(
            'UPDATE users SET first_name = $1, last_name = $2, username = $3, password = $4 where user_id = $5 RETURNING *',
            [first_name, 
            last_name, 
            username, 
            hashedPassword, 
            id],
        )
}

const deleteById = async (id) => {
    return await db
        .query(
            'DELETE FROM users WHERE user_id = $1',
            [id],
        )
}

module.exports = {
    getAll,
    getById,
    getByUsername,
    createUser,
    updateUser,
    deleteById
}