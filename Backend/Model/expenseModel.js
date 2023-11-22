const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const expenseData = sequelize.define('expenseData', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseAmount: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseType: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = expenseData;