module.exports = (sequelize, Sequelize) => {
    return sequelize.define('HospitalMetadata', {
        hospital_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "hospitals",
                key: "id"
            }
        },
        province: {
            type: Sequelize.STRING,
            allowNull: false
        },
        district: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM(
                'general', 'speciality', 'multi-speciality', 'trauma-center'
            ),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: "hospital_metadata",

    });
}