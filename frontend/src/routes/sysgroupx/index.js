import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import SysGroupFilter from './SysGroupFilter';
import SysGroupModal from './SysGroupModal';
import SysGroupTable from './SysGroupTable';

function SysGroupX({ location, dispatch, sysGroupX, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType } = sysGroupX
  const { field, keyword } = location.query
  const { pageSize } = pagination;

  const sysGroupModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `sysGroupX/${modalType}`,
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'sysGroupX/hideModal',
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
        type: 'sysGroupX/delete',
        payload: id,
      });
    },
    onEditItem(item) {
      dispatch({
        type: 'sysGroupX/showModal',
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
        type: 'sysGroupX/showModal',
        payload: {
          modalType: 'create',
        },
      });
    },
  }

  /* 这样写的作用是，重复显示和隐藏form表单，每次都是新生成的表单，否则表单的数据需要手动重置 */
  const SysGroupModalGen = () =>
    <SysGroupModal {...sysGroupModalProps} />

  return (
    <div className="content-inner">
      <SysGroupFilter {...sysGroupFilterProps} />
      <SysGroupTable {...sysGroupTableProps} />
      <SysGroupModalGen />
    </div>
  );
}

SysGroupX.propTypes = {
  sysGroupX: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ sysGroupX, loading }) => ({ sysGroupX, loading: loading.models.sysgroupx }))(SysGroupX);
