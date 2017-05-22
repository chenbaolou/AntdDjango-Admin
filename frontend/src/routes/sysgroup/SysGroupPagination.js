import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { config } from '../../utils';
const { defaultPagination } = config

function SysGroupPagination(pagination) {
  console.log(pagination);
  return (
    <Pagination {...defaultPagination} {...pagination} />
  );
}

SysGroupPagination.propTypes = {
  pagination: PropTypes.object,
}

export default SysGroupPagination;
