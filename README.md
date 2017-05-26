# AntdDjango-Admin

## 概述
本项目是基于[antd-admin](https://github.com/zuiidea/antd-admin)和[django](https://github.com/django/django)两个项目，其中[antd-admin](https://github.com/zuiidea/antd-admin)是基于蚂蚁金服的[ant-design](https://github.com/ant-design/ant-design)框架构建，在此对上述框架和其附属框架表示感谢。

## 代码结构
backend目录是后端实现， frontend目录是前端实现。这里只是提供全栈演示，完全可以根据需求独立使用。

## 运行方式
```bash
cd backend
python manage.py runserver

cd frontend
npm run dev
```
当然这只是在测试环境中的调试方式，生产环境的部署方式可以参考相关资料。由于在同一台电脑上运行两个服务端口号会产生冲突，后端使用8000端口号/前端使用8001端口号，故web请求采用的是跨域的方式。这种情况在实际生产环境是不存在，大家如果有什么好的方式可以告诉我。
