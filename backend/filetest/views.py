# -*- coding: UTF-8 -*-
import sys
from models import FileTest
from util.Serializer import serializer
from django.http import JsonResponse
import json
from django.utils import timezone
from django.core.files import File
import os

def filetests(request):

    #加载列表，包括分页、过滤和排序
    if request.method == 'GET':

        start = int(request.GET.get('start') or 0)
        limit = int(request.GET.get('limit') or sys.maxint)
        field = request.GET.get('field') or 'name'
        keyword = request.GET.get('keyword') or ''
        kwargs = {field+'__icontains': keyword}
        sortField = request.GET.get('sortField') or 'id'
        sortOrder = request.GET.get('sortField') or 'ascend'
        if sortOrder == 'descend':
            sortOrder = '-'
        else:
            sortOrder = ''

        total = FileTest.objects.filter(**kwargs).count()
        data = FileTest.objects.filter(**kwargs).order_by(sortOrder+sortField)[start:start + limit]

        ro = {
            'success': True,
            'total': total,
            'data': serializer(data, many=False, datetime_format="%Y-%m-%d %H:%M:%S")
        }

        return JsonResponse(ro, content_type="application/json")

    elif request.method == 'POST':
        request.data = json.loads(request.body)
        uploads = request.data["upload"]
        for upload in uploads:
            file = FileTest()
            file.name = upload["name"]
            file.createtime = timezone.now()
            file.file = File(open(upload["response"]["filePath"]))
            file.save()
        return JsonResponse({"success": True})

    elif request.method == 'DELETE':
        request.data = json.loads(request.body)
        ids = str(request.data["id"]).split(",")

        fileTests = FileTest.objects.filter(id__in=ids)
        for fileTest in fileTests:
            os.remove(str(fileTest.file))
        fileTests.delete()

        return JsonResponse({'success': True, 'count': len(ids)})

