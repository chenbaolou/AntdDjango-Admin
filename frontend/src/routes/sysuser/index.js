import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import SysUserFilter from './filter';
import { UserModal, GroupTransfer } from './modal';
import BTable from '../../components/BTable';
import { DropOption } from '../../components';
import { config } from '../../utils';
import { Modal, message } from 'antd';
const confirm = Modal.confirm;

function SysUser({ dispatch, sysUser }) {
  const { currentItem, modalVisible, transferVisible, modalType, filterCase, timestamp, selectedRowKeys, groupList, targetKeys } = sysUser;
  const sysUserModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `sysUser/${modalType}`,
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'sysUser/hideModal',
      });
    },
  };

  const sysGroupTransferProps = {
    visible: transferVisible,
    groupList,
    targetKeys,
    onCancel() {
      dispatch({
        type: 'sysUser/hideWindow',
        payload: {
          wName: 'transferVisible',
        },
      });
    },
    onOk(data) {
      dispatch({
        type: 'sysUser/updateGroup',
        payload: {
          userIds: selectedRowKeys.join(','),
          groupIds: data.join(','),
        },
      });
    },
  };

  const sysUserFilterProps = {
    onFilterChange(value) {
      dispatch({
        type: 'sysUser/search',
        payload: value,
      });
    },
    onAdd() {
      dispatch({
        type: 'sysUser/showModal',
        payload: {
          modalType: 'create',
        },
      });
    },
    onDelete() {
      if (selectedRowKeys.length === 0) {
        return;
      }
      confirm({
        title: '您确定要删除选中记录吗?',
        onOk() {
          dispatch({
            type: 'sysUser/delete',
            payload: selectedRowKeys.join(','),
          });
        },
      });
    },
    onGroupSet() {
      // 加载组列表，每次设置的时候夹在一次，以防远程用户组信息已经变化
      dispatch({
        type: 'sysUser/queryGroup',
        payload: {},
      });
      /* dispatch({
        type: 'sysUser/showWindow',
        payload: {
          wName: 'transferVisible',
        },
      });*/
    },
    selectedRowKeys,
  };

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      dispatch({
        type: 'sysUser/showModal',
        payload: {
          modalType: 'update',
          currentItem: record,
        },
      });
    } else if (e.key === '2') {
      if (record.username === 'root') {
        message.warning('root用户不能被删除');
        return false;
      }
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk() {
          dispatch({
            type: 'sysUser/delete',
            payload: record.id,
          });
        },
      });
    }
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (_selectedRowKeys, selectedRows) => {
      let _targetKeys = [];
      selectedRows.forEach((item1) => {
        item1.groups.forEach((item2) => {
          if (!_targetKeys.includes(item2.id)) {
            _targetKeys.push(item2.id);
          }
        });
      });
      dispatch({
        type: 'sysUser/rowSelection',
        payload: {
          selectedRowKeys: _selectedRowKeys,
          targetKeys: _targetKeys,
        },
      });
    },
    getCheckboxProps: record => ({
      disabled: record.username === 'root',    // Column configuration not to be checked
    }),
    selectedRowKeys,
  };

  const expandedRowRender = record => {
    const groups = record.groups;
    let groupNames = groups.map((item) => item.name);
    return <p>所在用户组: {groupNames.join(', ')}</p>;
  };

  const fetchDataTableProps = {
    fetch: {
      url: config.api.sysusers,
      data: {
        ...filterCase,
      },
      dataKey: 'data',
      timestamp,
    },
    columns: [{
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username - b.username,
    }, {
      title: '创建时间',
      dataIndex: 'date_joined',
      key: 'date_joined',
    }, {
      title: '最后登录时间',
      dataIndex: 'last_login',
      key: 'last_login',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />;
      },
    },
    ],
    rowKey: record => record.id,
    rowSelection,
    expandedRowRender,
  };

  /* 这样写的作用是，重复显示和隐藏form表单，每次都是新生成的表单，否则表单的数据需要手动重置 */
  const SysUserModalGen = () =>
    <UserModal {...sysUserModalProps} />;

  const SysGroupTransferGen = () =>
    <GroupTransfer {...sysGroupTransferProps} />;

  return (
    <div className="content-inner">
      <SysUserFilter {...sysUserFilterProps} />
      <BTable {...fetchDataTableProps} />
      <SysUserModalGen />
      <SysGroupTransferGen />
    </div>
  );
}

SysUser.propTypes = {
  sysUser: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ sysUser }) => ({ sysUser }))(SysUser);
