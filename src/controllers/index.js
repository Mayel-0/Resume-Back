function getHealth(req, res) {
  res.json({ success: true, message: "API is healthy" });
}

module.exports = {
  getHealth,
};
