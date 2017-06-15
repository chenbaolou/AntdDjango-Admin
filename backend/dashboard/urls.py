from rest_framework import routers
from django.conf.urls import include, url

urlpatterns = [
    url(r'^filetests$', 'filetest.views.filetests'),
]