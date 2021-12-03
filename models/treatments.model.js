module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Treatment', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        nepali_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: Sequelize.ENUM(
                'general', 'consulting', 'surgical', 'therapy'
            ),
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT(9,2).UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: "treatments",
        timestamps: false
    });
}