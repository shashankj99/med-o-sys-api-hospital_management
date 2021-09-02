module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Hospital', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        province_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        district_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        city_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        phone_no: {
            type: Sequelize.STRING(15),
            validate: {
                min: 7
            },
            allowNull: false
        },
        mobile_no: {
            type: Sequelize.STRING(15),
            validate: {
                min: 7
            },
            allowNull: true
        },
        email_address: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            allowNull: false
        },
        website: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'hospitals',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};
