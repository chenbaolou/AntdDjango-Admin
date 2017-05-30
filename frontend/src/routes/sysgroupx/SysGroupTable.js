import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal } from 'antd';
import { DropOption } from '../../components';

const confirm = Modal.confirm;

function table({ loading, dataSource, pagination, onPageChange, onShowSizeChange, onDeleteItem, onEditItem }) {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
  }, {
    title: '操作',
    key: 'operation',
    width: 100,
    render: (text, record) => {
      return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />;
    },
  },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onShowSizeChange={onShowSizeChange}
        onChange={onPageChange}
        pagination={pagination}
        rowKey={record => record.id}
      />
    </div>
  );
}

table.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onShowSizeChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
};

export default table;
