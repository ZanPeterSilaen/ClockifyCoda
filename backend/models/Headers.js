module.exports = (sequelize, DataTypes) => {
    const Headers = sequelize.define("Headers", {
        coda_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clockify_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Headers
}