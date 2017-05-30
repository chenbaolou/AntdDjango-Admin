from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from common.views import SkipSameStorage


class FileTest(models.Model):
    name = models.CharField(max_length=128, default=None, null=True)
    file = models.FileField(upload_to=settings.MEDIA_ROOT+'filetest', storage=SkipSameStorage())
    createtime = models.DateTimeField()
    groups = models.ManyToManyField(Group)