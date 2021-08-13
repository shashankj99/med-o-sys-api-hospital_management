module.exports = (week_day) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = week_day.charAt(0).toUpperCase() + week_day.slice(1);

    return [days.includes(day), day];
}