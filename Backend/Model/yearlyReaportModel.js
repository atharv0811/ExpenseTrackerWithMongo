const { Sequelize } = require("sequelize");
const sequelize = require('../db');
const yearlyReportDb = sequelize.define('YearlyReport', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    year: {
        type: Sequelize.STRING,
        allowNull: false
    },
    TotalExpense: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
    }
})
module.exports = yearlyReportDb;