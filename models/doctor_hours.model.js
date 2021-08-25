module.exports = (sequelize, Sequelize) => {
    return sequelize.define("DoctorHour", {
        doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "doctors",
                key: "id"
            }
        },
        day: {
            type: Sequelize.STRING,
            allowNull: false
        },
        available_from: {
            type: Sequelize.TIME,
            allowNull: false
        },
        available_to: {
            type: Sequelize.TIME,
            allowNull: false
        },
        is_available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: true
        }
    }, {
        tableName: "doctor_hours",
        timestamps: false
    });
}