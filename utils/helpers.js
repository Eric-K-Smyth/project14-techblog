module.exports = {
  format_date: (date) => {
    // Check if date is valid
    if (!date) {
      return ''; // Return an empty string or another default value if date is undefined or null
    }

    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
};