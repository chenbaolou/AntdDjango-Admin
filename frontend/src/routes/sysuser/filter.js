import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Input, Select } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;

class Filter extends React.PureComponent {
  render() {
    const {
      onFilterChange,
      onAdd,
      onDelete,
      onGroupSet,
      form: {
        getFieldsValue,
        getFieldDecorator,
      },
      selectedRowKeys,
    } = this.props;

    const handleSubmit = () => {
      let fields = getFieldsValue();
      onFilterChange(fields);
    }

    return (
      <Row gutter={24}>
        <Col style={{ marginBottom: 16 }} span={10}>
          <InputGroup compact>
            {getFieldDecorator('field', { initialValue: 'username' })(
              <Select style={{ width: '80px' }}>
                <Option value="username">用户名</Option>
              </Select>)}
            {getFieldDecorator('keyword', { initialValue: '' })(
              <Search style={{ width: '200px' }} onSearch={handleSubmit} />
            )}
          </InputGroup>
        </Col>
        <Col style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button onClick={onAdd} size="large" icon="plus" style={{ marginRight: '10px' }} />
          <Button disabled={selectedRowKeys.length === 0} onClick={onDelete} size="large" icon="delete" style={{ marginRight: '10px' }} />
          <Button disabled={selectedRowKeys.length === 0} onClick={onGroupSet} size="large" icon="team" />
        </Col>
      </Row>
    );
  }
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onGroupSet: PropTypes.func,
  onFilterChange: PropTypes.func,
  selectedRowKeys: PropTypes.array,
}

export default Form.create()(Filter);
