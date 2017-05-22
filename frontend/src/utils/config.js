module.exports = {
  name: '登录系统',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin 版权所有 © 2017 由 chenbaolou 支持',
  logo: 'https://t.alipayobjects.com/images/T1QUBfXo4fXXXXXXXX.png',
  iconFontUrl: '//at.alicdn.com/t/font_c4y7asse3q1cq5mi.js',
  baseURL: 'http://localhost:8000',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:8001'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    userLogin: '/user/login',
    userLogout: '/user/logout',
    userInfo: '/user/userInfo',
    users: '/users',
    dashboard: '/dashboard',
    sysusers: '/sysusers',
    sysgroups: '/sysgroups',
  },
  defaultPagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    pageSize: 3,
    pageSizeOptions: ['3', '5', '10', '30', '500', '1000'],
    current: 1,
    total: null,
  },
}
