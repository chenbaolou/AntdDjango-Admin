import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import FileTestFilter from './filter';
import { UploadModal } from './modal';
import BTable from '../../components/BTable';
import { DropOption } from '../../components';
import { config } from '../../utils';
import { Modal } from 'antd';
const confirm = Modal.confirm;

function FileTest({ dispatch, fileTest }) {
  const { currentItem, modalVisible, modalType, filterCase, timestamp, selectedRowKeys } = fileTest;
  const uploadModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `fileTest/${modalType}`,
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'fileTest/hideWindow',
        payload: {
          wName: 'modalVisible',
        },
      });
    },
  };

  const filterProps = {
    onFilterChange(value) {
      dispatch({
        type: 'fileTest/search',
        payload: value,
      });
    },
    onAdd() {
      dispatch({
        type: 'fileTest/showWindow',
        payload: {
          modalType: 'create',
          wName: 'modalVisible',
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
            type: 'fileTest/delete',
            payload: selectedRowKeys.join(','),
          });
        },
      });
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
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk() {
          dispatch({
            type: 'fileTest/delete',
            payload: record.id,
          });
        },
      });
    }
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (_selectedRowKeys) => {
      dispatch({
        type: 'fileTest/rowSelection',
        payload: {
          selectedRowKeys: _selectedRowKeys,
        },
      });
    },
    selectedRowKeys,
  };

  const fetchDataTableProps = {
    fetch: {
      url: config.api.filetests,
      data: {
        ...filterCase,
      },
      dataKey: 'data',
      timestamp,
    },
    columns: [{
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name,
    }, {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '2', name: '删除' }]} />;
      },
    },
    ],
    rowKey: record => record.id,
    rowSelection,
  };

  /* 这样写的作用是，重复显示和隐藏form表单，每次都是新生成的表单，否则表单的数据需要手动重置 */
  const UploadModalGen = () =>
    <UploadModal {...uploadModalProps} />;

  return (
    <div className="content-inner">
      <FileTestFilter {...filterProps} />
      <BTable {...fetchDataTableProps} />
      <UploadModalGen />
    </div>
  );
}

FileTest.propTypes = {
  fileTest: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ fileTest }) => ({ fileTest }))(FileTest);
