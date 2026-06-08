const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const user = {
  create: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    const { nama, email, no_wa } = req.body;
    if (!nama || !email) {
      return res.status(400).json({ status: 'failed', message: 'Nama dan email diperlukan' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/admin/users`, {
        admin_id: req.session.admin.id,
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        no_wa: (no_wa || '').trim()
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal menambah user'
      });
    }
  },

  edit: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/admin/users/${req.params.id}`, {
        params: { admin_id: req.session.admin.id },
        withCredentials: true
      });

      if (apiResponse.data.status === 'success') {
        return res.json(apiResponse.data.data);
      }
      return res.status(404).json({ status: 'failed', message: 'User tidak ditemukan' });
    } catch (error) {
      console.error('Edit user error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mengambil data user'
      });
    }
  },

  update: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
    }

    const { nama, email, no_wa, status, role } = req.body;
    if (!nama && !email && !no_wa && !status && !role) {
      return res.status(400).json({ status: 'failed', message: 'Tidak ada data yang diubah' });
    }

    try {
      const apiResponse = await axios.put(`${API_BASE_URL}/admin/users/${req.params.id}`, {
        admin_id: req.session.admin.id,
        nama: nama?.trim(),
        email: email?.trim().toLowerCase(),
        no_wa: (no_wa || '').trim(),
        status,
        role
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal memperbarui user'
      });
    }
  }
};

module.exports = user;
