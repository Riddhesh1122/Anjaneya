const apiResponse = (message, data = null) => ({
  success: true,
  message,
  data,
});

module.exports = apiResponse;