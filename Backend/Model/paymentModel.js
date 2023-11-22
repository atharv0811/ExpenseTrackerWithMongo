const { Sequelize } = require("sequelize");
const sequelize = require("../db");

const OrderData = sequelize.define('orderData', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
})
module.exports = OrderData;