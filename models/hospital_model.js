module.exports = (sequelize, Sequelize) => {
    return sequelize.define('hospitals', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        no_of_beds: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        phone_no: {
            type: Sequelize.STRING(15),
            validate: {
                min: 7
            },
            allowNull: true
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
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
};
