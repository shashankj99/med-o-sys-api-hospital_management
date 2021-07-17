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
}