module.exports = (sequelize, Sequelize) => {
    return sequelize.define('PaymentHistory', {
        paymentable_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        paymentable_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.FLOAT(11, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        payment_method: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active_duration_in_years: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        valid_from: {
            type: Sequelize.DATE,
            allowNull: false
        },
        valid_till: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'payment_histories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}