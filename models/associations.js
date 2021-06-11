module.exports = (sequelize) => {
    sequelize.models.Hospital.belongsToMany(sequelize.models.Department, {
        through: 'department_hospital',
        foreignKey: 'hospital_id',
        as: 'departments',
        timestamps: false
    })

    sequelize.models.Department.belongsToMany(sequelize.models.Hospital, {
        through: 'department_hospital',
        foreignKey: 'department_id',
        as: 'hospitals',
        timestamps: false
    })
}