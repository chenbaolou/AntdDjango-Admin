from rest_framework import routers
from django.conf.urls import include, url
import views

routers = routers.DefaultRouter()
routers.register(r'sysusers', views.UserViewSet)
routers.register(r'sysgroup', views.GroupViewSet)

urlpatterns = [
    url(r'^user/login$', 'sysauth.views.login'),
    url(r'^user/logout$', 'sysauth.views.logout'),
    url(r'^user/userInfo', 'sysauth.views.userInfo'),
    url(r'^sysgroups$', 'sysauth.views.groups'),
    url(r'^sysgroups/(?P<name>.+)$', 'sysauth.views.checkGroupName'),
    url(r'^', include(routers.urls)),
]