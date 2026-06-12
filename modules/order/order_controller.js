const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5100';

const order = {
  getEditData: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/admin/orders/${req.params.id}/edit`, {
        params: { admin_id: req.session.admin.id }
      });
      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Get order edit data error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mengambil data edit order'
      });
    }
  },

  update: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    try {
      const apiResponse = await axios.put(`${API_BASE_URL}/admin/orders/${req.params.id}`, {
        ...req.body,
        admin_id: req.session.admin.id
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Update order error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal memperbarui order'
      });
    }
  },

  getCreateData: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/admin/orders/create-data`, {
        params: { admin_id: req.session.admin.id }
      });
      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Get create data error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mengambil data'
      });
    }
  },

  create: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/admin/orders`, {
        ...req.body,
        admin_id: req.session.admin.id
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal membuat order'
      });
    }
  },

  updateStatus: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!['pending', 'paid', 'cancel', 'delete'].includes(status)) {
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
