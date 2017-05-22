import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Input, Select } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;

const SysGroupFilter = ({
  onFilterChange,
  onAdd,
  filter,
  form: {
    getFieldsValue,
    getFieldDecorator,
  },
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue();
    onFilterChange(fields);
  }

  const { keyword } = filter

  return (
    <Row gutter={24}>
      <Col style={{ marginBottom: 16 }} span={10}>
        <InputGroup compact>
          {getFieldDecorator('field', { initialValue: 'name' })(
            <Select style={{ width: '80px' }}>
              <Option value="name">名称</Option>
            </Select>)}
          {getFieldDecorator('keyword', { initialValue: keyword })(
            <Search style={{ width: '200px' }} onSearch={handleSubmit} />
          )}
        </InputGroup>
      </Col>
      <Col style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button onClick={onAdd} size="large" icon="plus" style={{ marginRight: '10px' }} />
        <Button size="large" icon="delete" />
      </Col>
    </Row>
  );
}

SysGroupFilter.propTypes = {
  form: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  onFilterChange: PropTypes.func,
  filter: PropTypes.object,
}

export default Form.create()(SysGroupFilter);
