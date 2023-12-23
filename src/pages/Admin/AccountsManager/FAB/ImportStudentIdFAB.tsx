/* eslint-disable max-lines-per-function */
import { ImportOutlined, InboxOutlined } from '@ant-design/icons';
import { App, FloatButton, Modal, Space, Tooltip, UploadProps } from 'antd';
import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger';
import readXlsxFile, { Email } from 'read-excel-file';
import { keyBy, pickBy } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

import ExcelIconImg from '@/assets/excel.png';
import jwtService from '@/services/JwtService';
import { API_URL } from '@/config/index';
import userService from '@/services/UserService';
import { getFileNameFromContentDisposition } from '@/utils/index';

const validateFile = (file: File) =>
  readXlsxFile(file, {
    schema: {
      Email: {
        prop: 'email',
        type: Email,
        required: true,
      },

      'Student ID': {
        prop: 'student_id',
        type: String,
        required: true,
        validate(value: string) {
          if (value.length > 10 || value.length < 0) {
            throw new Error('Student ID must be between 0 and 10 characters');
          }
        },
      },
    },
    transformData(dataExcel: any[]) {
      return dataExcel.filter(
        (rowExcel: any[]) =>
          rowExcel.filter((columnExcel) => columnExcel !== null).length > 0
      );
    },
  }).then(({ rows, errors }) => {
    let duplicateStudentId = rows.reduce((a: any, e: any) => {
      a[e.student_id] = ++a[e.student_id] || 0;
      return a;
    }, {});
    duplicateStudentId = pickBy(duplicateStudentId, (value, key) => value >= 1);
    const duplicateStudentIdKeys = Object.keys(duplicateStudentId);
    if (duplicateStudentIdKeys.length !== 0) {
      throw new Error(
        `Duplicate Student ID: <strong class="text-red-500">${duplicateStudentIdKeys.join(
          ', '
        )}</strong>. Please check again!`
      );
    }

    let duplicateEmails = rows.reduce((a: any, e: any) => {
      a[e.email] = ++a[e.email] || 0;
      return a;
    }, {});
    duplicateEmails = pickBy(duplicateEmails, (value, key) => value >= 1);
    const duplicateEmailKeys = Object.keys(duplicateEmails);
    if (duplicateEmailKeys.length !== 0) {
      throw new Error(
        `Duplicate Email: <strong class="text-red-500">${duplicateEmailKeys.join(
          ', '
        )}</strong>. Please check again!`
      );
    }

    const errorsKeys = keyBy(errors, 'error');
    if (errors.length === 0) {
      if (rows.length === 0) {
        throw new Error('Empty file!');
      }
      return;
    }

    const details = () => {
      if (errorsKeys['Student ID must be between 0 and 10 characters']) {
        return 'Student ID must be between 0 and 10 characters';
      }

      if (errorsKeys.required) {
        return `Field is missing at row ${errorsKeys.required.row} in column '${errorsKeys.required.column}'`;
      }

      if (errorsKeys.invalid) {
        return `Field is ${errorsKeys.invalid.reason
          ?.split('_')
          .join(' ')} at row ${errorsKeys.invalid.row} in column '${
          errorsKeys.invalid.column
        }'`;
      }
    };

    throw new Error(details());
  });

function ImportStudentIdFAB() {
  const [openModal, setOpenModal] = useState(false);
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 1,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${jwtService.getToken()}`,
    },
    action: `${API_URL}/users/import-student-id`,
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isExcel =
          file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
          message.error('You can only upload Excel file!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('File must smaller than 1MB!');
        }

        if (!isExcel || !isLt1M) {
          reject(new Error('File must be Excel file and smaller than 1MB!'));
          return;
        }

        validateFile(file)
          .then(() => resolve(file))
          .catch((validateError: any) => {
            message.error(
              <span
                dangerouslySetInnerHTML={{
                  __html: validateError.message,
                }}
              />
            );
            reject(new Error(validateError.message));
          });
      });
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        queryClient.invalidateQueries({
          queryKey: ['users'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user'],
        });
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleDownloadTemplate = () => {
    userService.downloadMapStudentIdTemplate().then((response) => {
      const blobData = response.data as BlobPart;
      const url = window.URL.createObjectURL(
        new Blob([blobData], {
          type: response.headers['content-type'],
        })
      );
      const actualFileName = getFileNameFromContentDisposition(
        response.headers['content-disposition']
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        actualFileName ?? `map_student_id_template.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <>
      <FloatButton
        type="default"
        tooltip="Import student id"
        onClick={() => setOpenModal(true)}
        icon={<ImportOutlined />}
      />
      <Modal
        open={openModal}
        onCancel={handleClose}
        title={'Import student id'}
        okText="Import"
        centered
        destroyOnClose
        footer={null}
      >
        <Space className="w-full" direction="vertical">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to import
            </p>
            <p className="ant-upload-hint">
              Support only for a <strong>.xlsx</strong> file type. Max file
              size: 1MB
            </p>
          </Dragger>
          <div className="flex justify-center">
            <Tooltip title="Click here to download the template file.">
              <button
                className={
                  'twp px-4 py-2 rounded-md flex flex-row items-center border-2 border-gray-200 hover:opacity-[.75] disabled:cursor-not-allowed'
                }
                onClick={handleDownloadTemplate}
              >
                <img
                  className="w-[24px] h-[24px] mr-2"
                  src={ExcelIconImg}
                  alt="download template file"
                />
                <span className="flex-1 text-md font-semibold">
                  Download Template
                </span>
              </button>
            </Tooltip>
          </div>
        </Space>
      </Modal>
    </>
  );
}

export default ImportStudentIdFAB;
