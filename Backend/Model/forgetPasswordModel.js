const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const forgetPasswordModel = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    isactive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
})
module.exports = forgetPasswordModel;