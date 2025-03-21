// utils.js
export const getStatusFromValue = value => {
    if (value < 0.2) { return 'Good'; }
    else if (value < 0.4) { return 'Moderate'; }
    else if (value < 0.6) { return 'Unhealthy for Sensitive Groups'; }
    else if (value < 0.8) { return 'Unhealthy'; }
    else { return 'Hazardous'; }
};
