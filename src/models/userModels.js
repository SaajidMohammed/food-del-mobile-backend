const {pool} = require('../config/db.js');

const createUser = async (email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO Users(email,password) VALUES ($1,$2) RETURNING *',
        [email,passwordHash]
    );
    return result.rows[0];
}

const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM Users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

module.exports = {createUser, findUserByEmail}