import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Transfer } from 'antd';
const FormItem = Form.Item;
import { checkName } from '../../services/sysuser';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SysUserModal = ({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  let state = {};

  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
  }

  const checkUserName = (rule, value, callback) => {
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
    }, () => {
     // failure
    });
  };

  const handleConfirmBlur = (e) => {
    const value = e.target.value;
    state.confirmDirty = state.confirmDirty || !!value;
  };

  const checkPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  };

  const checkConfirm = (rule, value, callback) => {
    if (value && state.confirmDirty) {
      validateFields(['confirm'], { force: true });
    }
    callback();
  };


  const modalOpts = {
    title: `${type === 'create' ? '新建系统用户' : '系统用户'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            validateTrigger: 'onBlur',
            rules: [{
              required: true,
              message: '用户名未填写',
            }, {
              validator: checkUserName,
            },
            ],
          })(<Input disabled={type === 'update'} />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout} >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请输入确认密码',
            }, {
              validator: checkPassword,
            }],
          })(
            <Input type="password" onBlur={handleConfirmBlur} />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

SysUserModal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

class GroupTransfer extends React.PureComponent {
  state = {
    targetKeys: [],
  }
  componentWillMount() {
    let targetKeys = this.props.targetKeys;
    this.setState({ targetKeys });
  }
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  }
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }
  render() {
    const { visible, onCancel, groupList, onOk } = this.props;
    const handleOk = () => {
      onOk(this.state.targetKeys);
    };
    const transferOpts = {
      visible,
      onOk: handleOk,
      onCancel,
    };
    return (
      <Modal {...transferOpts} width={600}>
        <Transfer
          dataSource={groupList}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
          listStyle={{
            width: 250,
            height: 300,
          }}
        />
      </Modal>
    );
  }
}

GroupTransfer.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  groupList: PropTypes.array,
};

module.exports = {
  UserModal: Form.create()(SysUserModal),
  GroupTransfer,
};
