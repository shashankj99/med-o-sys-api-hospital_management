module.exports = (sequelize) => {
    /**
     * Hospital has many departments
     */
    sequelize.models.Hospital.belongsToMany(sequelize.models.Department, {
        through: 'department_hospital',
        foreignKey: 'hospital_id',
        as: 'departments',
        timestamps: false
    });

    /**
     * Department belongs to many hospital
     */
    sequelize.models.Department.belongsToMany(sequelize.models.Hospital, {
        through: 'department_hospital',
        foreignKey: 'department_id',
        as: 'hospitals',
        timestamps: false
    });

    /**
     * Hospital has many payment histories
     */
    sequelize.models.Hospital.hasMany(sequelize.models.PaymentHistory, {
        foreignKey: 'paymentable_id',
        constraints: false,
        scope: {
            paymentable_type: 'Hospital'
        }
    });

    /**
     * Payment history belongs to a hospital
     */
    sequelize.models.PaymentHistory.belongsTo(sequelize.models.Hospital, {
        foreignKey: 'paymentable_id',
        constraints: false
    })

    /**
     * Hospital has many doctors
     */
    sequelize.models.Hospital.hasMany(sequelize.models.Doctor, {
        foreignKey: 'hospital_id',
        as: "doctors",
        constraints: true
    });

    /**
     * Doctor belogs to a hospital
     */
    sequelize.models.Doctor.belongsTo(sequelize.models.Hospital, {
        foreignKey: "hospital_id",
        as: "hospital",
        constraints: true
    });

    /**
     * Department has many doctors
     */

    sequelize.models.Department.hasMany(sequelize.models.Doctor, {
        foreignKey: "department_id",
        constraints: true
    });

    /**
     * Doctor belongs to a department
     */
    sequelize.models.Doctor.belongsTo(sequelize.models.Department, {
        foreignKey: "department_id",
        constraints: true
    });

    /**
     * Hospital has many opd hours
     */
    sequelize.models.Hospital.hasMany(sequelize.models.OpdHour, {
        foreignKey: "hospital_id",
        as: "opd_hours",
        constraints: true
    });

    /**
     * OPD hours belong to a hospital
     */
    sequelize.models.OpdHour.belongsTo(sequelize.models.Hospital, {
        foreignKey: "hospital_id",
        as: "hospital",
        constraints: true
    });

    /**
     * Doctor has many opd hours
     */
     sequelize.models.Doctor.hasMany(sequelize.models.DoctorHour, {
        foreignKey: "doctor_id",
        as: "doctor_hours",
        constraints: true
    });

    /**
     * Doctor hours belong to a doctor
     */
    sequelize.models.DoctorHour.belongsTo(sequelize.models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
        constraints: true
    });

    /**
     * Doctor has one metadata
     */
     sequelize.models.Doctor.hasOne(sequelize.models.DoctorMetadata, {
        foreignKey: "doctor_id",
        as: "doctor_meta_data",
        constraints: true
    });

    /**
     * Metadata belong to a hospital
     */
    sequelize.models.DoctorMetadata.belongsTo(sequelize.models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
        constraints: true
    });
}