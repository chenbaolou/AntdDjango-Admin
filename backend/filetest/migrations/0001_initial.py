# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileTest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('filename', models.CharField(default=None, max_length=128, null=True)),
                ('file', models.FileField(upload_to=b'uploadfiletest')),
                ('createtime', models.DateTimeField()),
                ('groups', models.ManyToManyField(to='auth.Group')),
            ],
        ),
    ]
