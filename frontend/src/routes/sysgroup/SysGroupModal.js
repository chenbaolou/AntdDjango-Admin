import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
import { checkName } from '../../services/sysgroup';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data);
    });
  }

  const checkGroupName = (rule, value, callback) => {
    if (value === '') {
      callback();
      return true;
    }
    let p = checkName(value, item);
    p.then((response) => {
      if (response.status === 200) {
        callback();
      } else {
        callback('名称已经存在');
      }
    }, (response) => {
     // failure
    });
  }

  const modalOpts = {
    title: `${type === 'create' ? '新建组' : '修改组'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            validateTrigger: 'onBlur',
            rules: [{
              required: true,
              message: '名称未填写',
            }, {
              validator: checkGroupName,
            },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal);
