# -*- coding: UTF-8 -*-
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
import os
from django.conf import settings
import json
import uuid


class SkipSameStorage(FileSystemStorage):
    """
    存在相同文件，则跳过.
    """
    def save(self, name, content):
        if self.exists(name):
            #self.delete(name)
            return super(SkipSameStorage, self).open(name)
        return super(SkipSameStorage, self).save(name, content)

    def get_available_name(self, name):
        return name

def upload(request):
    if request.method == "POST":
        myFile = request.FILES.get("file", None)
        if not myFile:
            return JsonResponse({{"success": False, "message": "no file for uploading" }})
        postpath = ""
        if request.POST.get("path", None):
            postpath = request.POST.get("path")
        (shotname, extension) = os.path.splitext(myFile.name)
        realPath = os.path.join(settings.MEDIA_ROOT+postpath, uuid.uuid1().hex+extension)
        destination = open(realPath, 'wb+')
        for chunk in myFile.chunks():
            destination.write(chunk)
        destination.close()
        return JsonResponse({"success": True, "filePath": realPath})

    elif request.method == "DELETE":
        request.data = json.loads(request.body)
        filePath = request.data["filePath"] or None
        print(filePath)
        if filePath:
            try:
                os.remove(filePath)
            except Exception as e:
                return JsonResponse({"success": False, "message": "Failed to delete file"})
        return JsonResponse({"success": True})
