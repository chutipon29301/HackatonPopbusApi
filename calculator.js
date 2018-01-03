"use strict";
function getOutsideTemp() {
    const dateObj = new Date();

    function dateOfYear() {
        const dateOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let date = dateObj.getDate();
        for (let i = 0; i < dateObj.getMonth(); i++) {
            date += dateOfMonth[i];
        }
        return date;
    }

    function timeFactor() {
        const time = dateObj.getHours() * 60 + dateObj.getMinutes();
        const PEAK_TIME = 780;
        const MIDDAY_TIME = 720;
        let factor = time - (PEAK_TIME - MIDDAY_TIME);
        if (factor < 0) factor += 1440;
        if (factor > MIDDAY_TIME) factor -= 2 * (factor - MIDDAY_TIME);
        factor = (factor * 8 / MIDDAY_TIME) - 4;
        return factor;
    }

    function seasonFactor() {
        let factor = dateOfYear();
        if (factor > 183) factor -= 2 * (factor - 183);
        factor = (factor * 8 / 183) - 4;
        return factor;
    }

    function rainFactor() {
        return -70000 / (Math.pow(dateOfYear() - 213, 2) + 15000);
    }

    let temp = 30;
    temp += timeFactor();
    temp += seasonFactor();
    temp += rainFactor();
    return parseFloat(temp.toFixed(2));
}
function getInsideTemp(busWeight) {
    let outsideTemp = getOutsideTemp();
    let expectedTemp = 23;
    let maximumTemp = 5 + outsideTemp;
    if (maximumTemp < 34) maximumTemp = 34;
    let maxBusWeight = 2000;
    let factor;
    if (busWeight <= maxBusWeight) {
        factor = busWeight / maxBusWeight;
    }
    else {
        factor = 1 + 2 * (busWeight - maxBusWeight) / maxBusWeight;
    }
    let temp = expectedTemp + factor * (outsideTemp - expectedTemp);
    if (temp > maximumTemp) {
        temp = maximumTemp;
    }
    return parseFloat(temp.toFixed(2));
}
exports.getOutsideTemp = getOutsideTemp
exports.getInsideTemp = getInsideTemp