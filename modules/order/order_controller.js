const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const order = {
  updateStatus: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!['pending', 'paid', 'cancel'].includes(status)) {
      return res.status(400).json({ status: 'failed', message: 'Status tidak valid' });
    }

    try {
      const apiResponse = await axios.put(`${API_BASE_URL}/admin/orders/${req.params.id}/status`, {
        admin_id: req.session.admin.id,
        status
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Update order status error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mengubah status order'
      });
    }
  }
};

module.exports = order;
