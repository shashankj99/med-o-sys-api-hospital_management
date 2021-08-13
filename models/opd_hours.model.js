module.exports = (sequelize, Sequelize) => {
    return sequelize.define("OpdHour", {
        hospital_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "hospitals",
                key: "id"
            }
        },
        day: {
            type: Sequelize.STRING,
            allowNull: false
        },
        opening_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        closing_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        is_open: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: true
        }
    }, {
        tableName: "opd_hours",
        timestamps: false
    });
}