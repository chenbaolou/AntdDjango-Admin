# coding:utf-8
from __future__ import unicode_literals

import datetime
import copy
import json
import os

from util.TimeFormatFactory import TimeFormatFactory
# from Warning import remove_check

try:
    from django.db import models
    from django.db.models.fields.files import FieldFile
    from django.db.models import manager
    from django.core.paginator import Page
    from django.db.models.query import QuerySet
    import django
except ImportError:
    raise RuntimeError('django is required in django simple serializer')


# attr_dict中include_attr指定的属性
def _include_check(include_attr, attr_dict):
    if include_attr:
        ex_attr_dict = copy.deepcopy(attr_dict)
        attr_dict.clear()
        for attr in include_attr:
            if attr in ex_attr_dict:
                attr_dict[attr] = ex_attr_dict.get(attr, None)
    return attr_dict


# 剔除attr_dict中exclude_attr指定的属性
def _exclude_check(exclude_attr, attr_dict):
    if exclude_attr:
        for attr in exclude_attr:
            if attr in attr_dict:
                attr_dict.pop(attr)
    return attr_dict


# 获取结果集中属性
def _get_attr(model_data, time_func, foreign, many):

    dic_list = {}
    attr_list = model_data._meta.get_fields()
    tlist = set()

    for field in attr_list:
        tlist.add(field.name)

    attr_list = tlist

    for item in attr_list:
        attribute = getattr(model_data, item, None)
        if attribute == None:
            continue
        # 外键
        if isinstance(attribute, models.Model):
            if foreign:
                dic_list[item] = _get_attr(attribute, time_func, foreign, many)
        # many
        elif isinstance(attribute, manager.Manager):
            if many and not str(item).endswith('_art'):
                many_obj = attribute.all()
                many_list = []
                for mitm in many_obj:
                    many_item = _get_attr(mitm, time_func, foreign, many)
                    many_list.append(many_item)
                dic_list[item] = many_list
        elif isinstance(attribute, datetime.datetime):
            dic_list[item] = time_func(attribute)
        # 方便页面显示
        elif isinstance(attribute, FieldFile):
            dic_list[item+"name"] = os.path.basename(str(attribute))
            dic_list[item+"path"] = os.path.dirname(str(attribute))
        else:
            dic_list[item] = attribute

    if '_state' in dic_list:
        dic_list.pop('_state')

    return dic_list


def _data_convert(data, time_func, foreign, many, include_attr, exclude_attr):
    if isinstance(data, models.Model):
        attr_list = _get_attr(data, time_func, foreign, many)
        _include_check(include_attr, attr_list)
        _exclude_check(exclude_attr, attr_list)
        return attr_list
    elif isinstance(data, (QuerySet, Page)):
        result = []
        for item in data:
            attr_list = _get_attr(item, time_func, foreign, many)
            _include_check(include_attr, attr_list)
            _exclude_check(exclude_attr, attr_list)
            result.append(copy.copy(attr_list))
        return result
    elif isinstance(data, datetime.datetime):
        print('====')
        print(data)
        return time_func(data)
    elif isinstance(data, (unicode, str, bool, float)):
        return data
    elif isinstance(data, dict):
        for k, v in data.iteritems():
            data[k] = _data_convert(v, time_func, foreign, many, include_attr, exclude_attr)
        return data
    elif isinstance(data, list):
        for i, itm in enumerate(data):
            data[i] = _data_convert(itm, time_func, foreign, many, include_attr, exclude_attr)
        return data
    else:
        return None


def _output_convert(output_type, data):
    output_switch = {'dict': data, 'raw': data, 'json': json.dumps(data, indent=4)}
    return output_switch.get(output_type, None)


def serializer(data, datetime_format='timestamp', output_type='raw', include_attr=None, exclude_attr=None,
               foreign=False, many=False, **kwargs):
    foreign = kwargs or foreign
    time_func = TimeFormatFactory.get_time_func(datetime_format)
    result = _data_convert(data, time_func, foreign, many, include_attr, exclude_attr)
    return _output_convert(output_type, result)
