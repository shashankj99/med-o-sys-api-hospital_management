module.exports = (sequelize, Sequelize) => {
    return sequelize.define('HospitalRoom', {
        hospital_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "hospitals",
                key: "id"
            }
        },
        room_no: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        room_type: {
            type: Sequelize.ENUM(
                'general', 'sharing', 'deluxe', 'vip'
            ),
            allowNull: false
        },
        availability: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        price_per_day: {
            type: Sequelize.FLOAT(9,2).UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: "hospital_rooms",
        timestamps: false
    });
}