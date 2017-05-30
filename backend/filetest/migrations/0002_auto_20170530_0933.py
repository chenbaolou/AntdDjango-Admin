# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filetest', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='filetest',
            old_name='filename',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='filetest',
            name='file',
            field=models.FileField(upload_to=b'/var/tmp/upload/filetest'),
        ),
    ]
