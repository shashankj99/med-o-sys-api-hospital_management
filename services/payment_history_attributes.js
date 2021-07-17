const HandleDate = require("./handle_date");

module.exports = (requestBody) => {
    const amount = parseFloat(requestBody.amount);

    const activeDurationInYears = (amount > 100000)
        ? parseFloat(amount)/100000
        : 1;

    const validFromTillDate = HandleDate.valid_from_till(activeDurationInYears);

    return {
        amount,
        payment_method: requestBody.payment_method,
        active_duration_in_years: activeDurationInYears,
        valid_from: validFromTillDate[0],
        valid_till: validFromTillDate[1],
        status: true
    }
}