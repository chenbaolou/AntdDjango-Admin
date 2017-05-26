# -*- coding: UTF-8 -*-
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, filters
from django.contrib.auth import update_session_auth_hash, authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden, Http404, HttpResponseNotFound
from serializers import UserSerializer, GroupSerializer
from rest_framework.decorators import api_view
import json
import sys
from util.Serializer import serializer
from django.db.models import Q

class HttpResponseUnauthorized(HttpResponse):
    status_code = 401

class CheckAuthenticationMiddleware(object):
    def process_request(self, request):

        if request.user.is_authenticated() == False:
            #if request.is_ajax():
            if request.get_full_path() != "/user/login":
                return HttpResponseUnauthorized()
                #pass
            else:
                pass
        else:
            pass

    def process_response(self, request, response):
        response.setdefault("Access-Control-Allow-Credentials", True)
        response.setdefault("Access-Control-Allow-Origin", "http://localhost:8001")
        response.setdefault("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.setdefault("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

        if response.status_code == 403:
            return HttpResponseForbidden()
        else:
            return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('username', 'email',)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name')

@api_view(['POST'])
def login(request):
    (_username, _password) = (request.data['username'], request.data['password'])
    user = authenticate(username=_username, password=_password)
    _success = False
    _message = ''
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            _success = True
        else:
            _message = 'User is disabled, please contact administrator'
    else:
        _message = 'Username or password is incorrect, please re-enter'
    return JsonResponse({'success': _success, 'message': _message})

def logout(request):
    auth_logout(request)
    return JsonResponse({'success': True})

def userInfo(request):
    return JsonResponse({'user':{'id': 0, 'username':request.user.username,
                                 'permissions':['dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart', 'sysgroup']}})


def groups(request):

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

        total = Group.objects.filter(**kwargs).count()
        data = Group.objects.filter(**kwargs).order_by(sortOrder+sortField)[start:start + limit]

        ro = {
            'success': True,
            'total': total,
            'data': serializer(data, many=False)
        }

        return JsonResponse(ro, content_type="application/json")

    elif request.method == "DELETE":

        request.data = json.loads(request.body)
        ids = str(request.data["id"]).split(",")

        Group.objects.filter(id__in=ids).delete()

        return JsonResponse({'success':True, 'count': len(ids)})

    # 修改
    elif request.method == "PUT":
        request.data = json.loads(request.body)
        group = Group.objects.get(id=request.data["id"])
        group.name = request.data["name"]
        group.save()

        return JsonResponse({'success': True, 'count': 1})

    # 新增
    elif request.method == "POST":
        request.data = json.loads(request.body)

        group = Group()
        group.name = request.data["name"]
        group.save()

        return JsonResponse({'success': True, 'count': 1})


def checkGroupName(request, name=''):
    if request.method == 'HEAD':
        glist = Group.objects.filter(name=name)
        queryId = request.GET.get('id')
        if(queryId):
            glist = glist.filter(~Q(id=queryId))
        if len(glist) == 0:
            return JsonResponse({'success': True, 'name': name})
        else:
            return HttpResponseNotFound()

def users(request):

    #加载列表，包括分页、过滤和排序
    if request.method == 'GET':

        start = int(request.GET.get('start') or 0)
        limit = int(request.GET.get('limit') or sys.maxint)
        field = request.GET.get('field') or 'username'
        keyword = request.GET.get('keyword') or ''
        kwargs = {field+'__icontains': keyword}
        sortField = request.GET.get('sortField') or 'id'
        sortOrder = request.GET.get('sortField') or 'ascend'
        if sortOrder == 'descend':
            sortOrder = '-'
        else:
            sortOrder = ''

        total = User.objects.filter(**kwargs).count()
        data = User.objects.filter(**kwargs).order_by(sortOrder+sortField)[start:start + limit]

        ro = {
            'success': True,
            'total': total,
            'data': serializer(data, foreign=True, many=True, datetime_format="%Y-%m-%d %H:%M:%S")
        }

        return JsonResponse(ro, content_type="application/json")

    elif request.method == "DELETE":

        request.data = json.loads(request.body)
        ids = str(request.data["id"]).split(",")

        User.objects.filter(id__in=ids).delete()

        return JsonResponse({'success':True, 'count': len(ids)})

    # 修改
    elif request.method == "PUT":
        request.data = json.loads(request.body)
        user = User.objects.get(id=request.data["id"])
        user.username = request.data["username"]
        user.save()

        return JsonResponse({'success': True, 'count': 1})

    # 新增
    elif request.method == "POST":
        request.data = json.loads(request.body)

        user = User()
        user.username = request.data["username"]
        user.set_password(request.data["password"])
        user.save()

        return JsonResponse({'success': True, 'count': 1})


def checkUserName(request, username=''):
    if request.method == 'HEAD':
        _list = User.objects.filter(username=username)
        queryId = request.GET.get('id')
        if(queryId):
            _list = _list.filter(~Q(id=queryId))
        print(_list)
        if len(_list) == 0:
            return JsonResponse({'success': True, 'username': username})
        else:
            return HttpResponseNotFound()


def setUserGroup(request, groupIds=''):
    if request.method == 'PUT':
        request.data = json.loads(request.body)
        users = User.objects.filter(id__in=request.data['userIds'].split(','))
        groups = Group.objects.filter(id__in=groupIds.split(','))
        for user in users:
            user.groups = groups
            user.save()
        return JsonResponse({'success': True})
