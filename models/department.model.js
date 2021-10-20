module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Department', {
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
        no_of_beds: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'departments',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}