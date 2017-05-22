module.exports = [
  {
    id: 1,
    icon: 'laptop',
    name: 'Dashboard',
    router: '/dashboard',
  },
  {
    id: 2,
    bpid: 1,
    name: 'User Manage',
    icon: 'user',
    router: '/users',
  },
  {
    id: 4,
    bpid: 1,
    name: '权限管理',
    icon: 'user',
  },
  {
    id: 41,
    bpid: 4,
    mpid: 4,
    name: '用户组',
    icon: 'team',
    router: '/sysgroup',
  },
  {
    id: 42,
    bpid: 4,
    mpid: 4,
    name: '用户',
    icon: 'user',
    router: '/sysuser',
  },
]
