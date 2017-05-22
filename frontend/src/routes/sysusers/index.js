import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import SysUserList from './SysUserList';
import SysGroupTree from '../sysgroup/SysGroupTable';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Button } from 'antd';

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

  const sysGroupTreeProps = {

    onExpand(expandedKeys){
      console.log('onExpand', arguments);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    },

    onCheck(checkedKeys) {
      this.setState({
        checkedKeys,
        selectedKeys: ['0-3', '0-4'],
      });
    },

    onSelect(selectedKeys, info) {
      console.log('onSelect', info);
      this.setState({ selectedKeys });
    },
  };

  return (
    <div className="content-inner">
      <Row gutter={2}>
        <Col span={8}>
          <Card title="用户组">
            <SysGroupTree {...sysGroupTreeProps} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="用户">
            <SysUserList {...sysUserListProps} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

SysUsers.propTypes = {
  sysusers: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ sysusers, loading }) => ({ sysusers, loading: loading.models.users }))(SysUsers);
