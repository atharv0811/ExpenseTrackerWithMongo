const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const UrlDb = sequelize.define('DurlData', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileUrl: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
module.exports = UrlDb;