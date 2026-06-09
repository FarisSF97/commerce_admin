const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5100';

const dashboard = {
  index: async (req, res) => {
    if (!req.session.admin) {
      return res.redirect('/login');
    }

    const admin = req.session.admin;
    const validTabs = ['info', 'security', 'users', 'orders'];
    const activeTab = validTabs.includes(req.query.tab) ? req.query.tab : 'info';

    // Common query params
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = (req.query.search || '').trim();

    // User management params
    const filter_status = ['aktif', 'suspend', 'cancel'].includes(req.query.filter_status) ? req.query.filter_status : '';
    const allowedUserSortBy = ['nama', 'email', 'no_wa', 'status', 'role', 'created_at'];
    const user_sort_by = allowedUserSortBy.includes(req.query.user_sort_by) ? req.query.user_sort_by : 'created_at';
    const user_sort_dir = req.query.user_sort_dir === 'ASC' ? 'ASC' : 'DESC';

    // Order management params
    const allowedSortBy = ['invoice', 'tanggal', 'pelanggan', 'produk', 'qty', 'total', 'status'];
    const sort_by = allowedSortBy.includes(req.query.sort_by) ? req.query.sort_by : 'tanggal';
    const sort_dir = req.query.sort_dir === 'ASC' ? 'ASC' : 'DESC';
    const filter_order_status = ['pending', 'paid', 'cancel', 'delete'].includes(req.query.filter_order_status) ? req.query.filter_order_status : '';

    const adminId = admin.id;

    try {
      // Always fetch users for the users tab
      const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, {
        params: { admin_id: adminId, page, limit, search, filter_status, sort_by: user_sort_by, sort_dir: user_sort_dir },
        withCredentials: true
      });

      // Always fetch orders for the orders tab
      const ordersRes = await axios.get(`${API_BASE_URL}/admin/orders`, {
        params: { admin_id: adminId, page, limit, search, sort_by, sort_dir, filter_status: filter_order_status },
        withCredentials: true
      });

      const usersData = usersRes.data.status === 'success' ? usersRes.data.data : { users: [], pagination: { page: 1, totalPages: 1, total: 0 } };
      const ordersData = ordersRes.data.status === 'success' ? ordersRes.data.data : { orders: [], pagination: { page: 1, totalPages: 1, total: 0 } };

      return res.render('dashboard/views/dashboard', {
        admin: admin,
        activeTab: activeTab,

        // Users tab data
        users: usersData.users,
        usersPage: usersData.pagination.page,
        usersTotalPages: usersData.pagination.totalPages,
        usersTotal: usersData.pagination.total,

        // Orders tab data
        orders: ordersData.orders,
        ordersPage: ordersData.pagination.page,
        ordersTotalPages: ordersData.pagination.totalPages,
        ordersTotal: ordersData.pagination.total,

        // Shared query params
        search: search,
        filter_status: filter_status,
        user_sort_by: user_sort_by,
        user_sort_dir: user_sort_dir,

        // Order-specific params
        sort_by: sort_by,
        sort_dir: sort_dir,
        filter_order_status: filter_order_status
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.render('dashboard/views/dashboard', {
        admin: admin,
        activeTab: activeTab,
        users: [],
        usersPage: 1,
        usersTotalPages: 1,
        usersTotal: 0,
        orders: [],
        ordersPage: 1,
        ordersTotalPages: 1,
        ordersTotal: 0,
        search: search,
        filter_status: filter_status,
        user_sort_by: user_sort_by,
        user_sort_dir: user_sort_dir,
        sort_by: sort_by,
        sort_dir: sort_dir,
        filter_order_status: filter_order_status
      });
    }
  }
};

module.exports = dashboard;
