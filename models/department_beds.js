module.exports = (sequelize, Sequelize) => {
    return sequelize.define('DepartmentBed', {
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
        bed_no: {
            type: Sequelize.INTEGER.UNSIGNED,
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
        tableName: "department_beds",
        timestamps: false
    });
}