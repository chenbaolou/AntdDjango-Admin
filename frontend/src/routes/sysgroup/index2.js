import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import SysGroupFilter from './SysGroupFilter';
import SysGroupModal from './SysGroupModal';
import BTable from '../../components/BTable';
import { config } from '../../utils';
import { DropOption } from '../../components';
import { Modal } from 'antd';
const confirm = Modal.confirm

function SysGroup({ location, dispatch, sysGroup, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType } = sysGroup
  const { field, keyword } = location.query
  const { pageSize } = pagination;

  const sysGroupModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `sysGroup/${modalType}`,
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'sysGroup/hideModal',
      });
    },
  }

  const sysGroupTableProps = {
    dataSource: list,
    loading,
    pagination,
    location,
    onPageChange(page) {
      const { query, pathname } = location;
      let start = 0;
      let limit = pagination.pageSize;
      let current = page.current;
      /* pageSize改变 */
      if (page.pageSize !== pagination.pageSize) {
        limit = page.pageSize;
      } else {
        /* page改变 */
        start = (page.current - 1) * pagination.pageSize;
      }
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          start,
          limit,
          current,
        },
      }));
    },
    onDeleteItem(id) {
      dispatch({
        type: 'sysGroup/delete',
        payload: id,
      });
    },
    onEditItem(item) {
      dispatch({
        type: 'sysGroup/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      });
    },
  }

  const sysGroupFilterProps = {
    field,
    keyword,
    filter: {
      ...location.query,
    },
    onFilterChange(value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          start: 0,
          limit: pageSize,
        },
      }));
    },
    onAdd() {
      dispatch({
        type: 'sysGroup/showModal',
        payload: {
          modalType: 'create',
        },
      });
    },
  }

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      dispatch({
        type: 'sysGroup/showModal',
        payload: {
          modalType: 'update',
          currentItem: record,
        },
      });
      fetchDataTableProps.reload();
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk() {
          dispatch({
            type: 'sysGroup/delete',
            payload: record.id,
          });
        },
      });
    }
  }

  const fetchDataTableProps = {
    fetch: {
      url: config.api.sysgroups,
      data: {
        results: 10,
        testPrams: 'test',
      },
      dataKey: 'data',
    },
    columns: [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
    ],
    rowKey: record => record.id,
    reload: () => {
      fetchDataTableProps.fetch.datetime = new Date();
    },
  }

  /* 这样写的作用是，重复显示和隐藏form表单，每次都是新生成的表单，否则表单的数据需要手动重置 */
  const SysGroupModalGen = () =>
    <SysGroupModal {...sysGroupModalProps} />

  return (
    <div className="content-inner">
      <SysGroupFilter {...sysGroupFilterProps} />
      <BTable {...fetchDataTableProps} />
      <SysGroupModalGen />
    </div>
  );
}

SysGroup.propTypes = {
  sysGroup: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ sysGroup, loading }) => ({ sysGroup, loading: loading.models.sysgroup }))(SysGroup);
