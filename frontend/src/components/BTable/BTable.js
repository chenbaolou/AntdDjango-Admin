import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { request, config } from '../../utils';
const { defaultPagination } = config;
import lodash from 'lodash';

class BTable extends React.Component {
  constructor(props) {
    super(props);
    const { dataSource, pagination = { ...defaultPagination } } = props;
    this.state = {
      loading: false,
      dataSource,
      fetchData: {},
      pagination,
    };
  }

  componentDidMount() {
    if (this.props.fetch) {
      this.fetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    const staticNextProps = lodash.cloneDeep(nextProps);
    const nextFetch = staticNextProps.fetch;
    const { fetch } = this.props;
    if (!lodash.isEqual(nextFetch, fetch)) {
      this.props = nextProps;
      // 对表格中的数据刷新后取消选中的行
      if (this.props.rowSelection) {
        this.props.rowSelection.selectedRowKeys = [];
      }
      this.fetch();
    }
  }

  handleTableChange = (page, filters, sorter) => {
    const pagination = this.state.pagination;
    pagination.current = page.current;
    let start = 0;
    let limit = pagination.pageSize;
    /* pageSize改变 */
    if (page.pageSize !== pagination.pageSize) {
      limit = page.pageSize;
      pagination.pageSize = page.pageSize;
    } else {
      /* page改变 */
      start = (page.current - 1) * pagination.pageSize;
    }
    this.setState({
      pagination,
      fetchData: {
        start,
        limit,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      },
    }, () => {
      this.fetch();
    });
  }

  fetch = () => {
    const { fetch: { url, data, dataKey } } = this.props;
    const { fetchData } = this.state;
    this.setState({ loading: true });
    fetchData.start = fetchData.start || 0;
    fetchData.limit = fetchData.limit || this.state.pagination.pageSize;
    this.promise = request({
      url,
      data: {
        ...data,
        ...fetchData,
      },
    }).then((result) => {
      if (!this.refs.BTable) {
        return;
      }
      const { pagination } = this.state;
      pagination.total = result.total || pagination.total;
      this.setState({
        loading: false,
        dataSource: dataKey ? result[dataKey] : result.data,
        pagination,
      });
    });
  }

  render() {
    const { fetch, rowKey, rowSelection, ...tableProps } = this.props;
    const { loading, dataSource, pagination } = this.state;
    return (
      <Table
        ref="BTable"
        bordered
        loading={loading}
        onChange={this.handleTableChange}
        {...tableProps}
        pagination={pagination}
        dataSource={dataSource}
        rowKey={rowKey}
        rowSelection={rowSelection}
      />
    );
  }
}


BTable.propTypes = {
  fetch: PropTypes.object,
  rowKey: PropTypes.func,
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowSelection: PropTypes.object,
};

export default BTable;
