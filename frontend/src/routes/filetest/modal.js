import React from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Upload, Button, Icon } from 'antd';
const FormItem = Form.Item;
import { baseURL } from '../../utils/config';
import { removeFile } from '../../services/common';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class UploadModal extends React.PureComponent {
  state = {
    fileList: [],
    filePath: null,
  }
  render() {
    const {
      visible,
      onCancel,
      onOk,
      type,
      form: {
        getFieldsValue,
        getFieldDecorator,
        validateFields,
      },
    } = this.props;
    const handleOk = () => {
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
    const handleRemove = () => {
      let filePath = this.state.filePath;
      let p = removeFile({ filePath });
      p.then((response) => {
        if (response.status === 200) {
          console.log(response);
          return true;
        }
      }, () => {
       // failure
      });
    }

    const windowClose = () => {
      handleRemove();
      onCancel();
    }

    const modalOpts = {
      title: `${type === 'create' ? '上传文件' : '修改文件'}`,
      visible,
      onOk: handleOk,
      onCancel: windowClose,
      wrapClassName: 'vertical-center-modal',
    }

    const uploadOpts = {
      name: 'file',
      action: `${baseURL}/common/upload`,
      listType: 'text',
      multiple: false,
      data: { path: 'filetest' },
      withCredentials: true,
      onRemove: handleRemove,
    }

    const handleChange = (info) => {
      let fileList = info.fileList;
      if (info.file.response) {
        let filePath = info.file.response.filePath;
        this.setState({ filePath });
      }
      this.setState({ fileList });
      console.log(this.state);
      return info && info.fileList;
    }

    return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem
          {...formItemLayout}
          label="Upload"
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: handleChange,
            rules: [{
              required: true,
              message: '请上传文件',
            }],
          })(
            <Upload {...uploadOpts} >
              <Button disabled={this.state.fileList.length === 1}>
                <Icon type="upload" /> 上传
              </Button>
            </Upload>
          )}
        </FormItem>
      </Form>
    </Modal>
    );
  }
}

UploadModal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

module.exports = {
  UploadModal: Form.create()(UploadModal),
}
