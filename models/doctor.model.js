module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Doctor', {
        reg_no: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        full_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        email_address: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        mobile_number: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            unique: true
        },
        hospital_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "hospitals",
                key: "id"
            }
        },
        department_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "departments",
                key: "id"
            }
        },
        degree: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        speciality: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        on_call: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: "doctors",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
};