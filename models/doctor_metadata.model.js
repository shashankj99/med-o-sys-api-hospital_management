module.exports = (sequelize, Sequelize) => {
    return sequelize.define("DoctorMetadata", {
        doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "doctors",
                key: "id"
            }
        },
        type: {
            type: Sequelize.ENUM('surgeon', 'physician', 'consultant'),
            allowNull: false
        },
        per_patient_time: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true
        },
        total_patient_count: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        mortality_rate: {
            type: Sequelize.FLOAT(3,1).UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: "doctor_metadatas",
        timestamps: false
    });
}