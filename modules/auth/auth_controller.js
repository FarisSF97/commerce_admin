const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const auth = {
  login: (req, res) => {
    if (req.session.admin) {
      return res.redirect('/dashboard');
    }
    res.render('auth/views/login');
  },

  processLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const apiResponse = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
        withCredentials: true
      });

      if (apiResponse.data.status === 'success') {
        const userData = apiResponse.data.data;

        if (userData.role !== 'admin') {
          return res.status(403).json({
            status: 'failed',
            message: 'Hanya admin yang bisa login di sini'
          });
        }

        req.session.admin = userData;
        return res.json({ status: 'success', message: 'Login successful' });
      }

      return res.status(apiResponse.data.code || 400).json({
        status: 'failed',
        message: apiResponse.data.message || 'Login failed'
      });
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: message
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  },

  changePassword: async (req, res) => {
    try {
      const { password } = req.body;
      const admin = req.session.admin;

      if (!admin || !admin.email) {
        return res.status(401).json({ status: 'failed', message: 'Silakan login terlebih dahulu' });
      }

      if (!password || password.length < 4) {
        return res.status(400).json({ status: 'failed', message: 'Password minimal 4 karakter' });
      }

      const apiResponse = await axios.post(`${API_BASE_URL}/change_password`, {
        email: admin.email,
        password: password
      }, { withCredentials: true });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        status: 'failed',
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      });
    }
  }
};

module.exports = auth;
