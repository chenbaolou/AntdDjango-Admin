import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import SysUserList from './SysUserList';
import { routerRedux } from 'dva/router';

function SysUsers({ location, dispatch, sysusers, loading }) {
  const { list, pagination, currentItem, isMotion } = sysusers
  const { field, keyword } = location.query;

  const sysUserListProps = {
    dataSource: list,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange(page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }));
    },
  };

  return (
    <SysUserList {...sysUserListProps} />
  );
}

SysUsers.propTypes = {
  sysusers: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ sysusers, loading }) => ({ sysusers, loading: loading.models.users }))(SysUsers);
