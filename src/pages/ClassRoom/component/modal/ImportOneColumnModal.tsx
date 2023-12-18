/* eslint-disable max-lines-per-function */
import { CloseOutlined } from '@ant-design/icons';
import { App, Button, Divider, Form, Modal, Select, Tooltip } from 'antd';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useParams } from 'react-router-dom';
import readXlsxFile, { Integer } from 'read-excel-file';
import _ from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

import ImportFileImg from '@/assets/import-file.png';
import ExcelIconImg from '@/assets/excel.png';
import XLSXIcon from '@/assets/xlsx_ext.png';
import CSVIcon from '@/assets/csv_ext.png';
import ClassGradeService from '@/services/ClassGradeService';
import { formatBytes, getFileNameFromContentDisposition } from '@/utils/index';
import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';

const fileTypes = ['xlsx'];

interface ImportGradeTableModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  columns: GradeColumn[];
}

function ImportOneColumnModal({
  open,
  setOpen,
  columns = [],
}: ImportGradeTableModalProps) {
  // Antd Form
  const [form] = Form.useForm();
  const hasSelectedColumn = !!Form.useWatch('column', form);

  const { notification } = App.useApp();
  const { id: classId } = useParams();

  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // React query
  const queryClient = useQueryClient();

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['class-grades', classId],
    });
    setError(null);
    setSelectedFile(null);
    setOpen(false);
    form.resetFields();
  };

  // Actions
  const handleFileChange = (file: File) => {
    readXlsxFile(file, {
      schema: {
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
        Grade: {
          prop: 'grade',
          type: Integer,
          required: true,
          validate(value: number) {
            if (value > 10 || value < 0) {
              throw new Error('Grade must be between 0 and 10');
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
    })
      .then(({ rows, errors }) => {
        let duplicateStudentId = rows.reduce((a: any, e: any) => {
          a[e.student_id] = ++a[e.student_id] || 0;
          return a;
        }, {});

        duplicateStudentId = _.pickBy(
          duplicateStudentId,
          (value, key) => value > 1
        );
        const duplicateStudentIdKeys = Object.keys(duplicateStudentId);
        if (duplicateStudentIdKeys.length !== 0) {
          throw new Error(
            `Duplicate Student ID: <strong class="text-red-500">${duplicateStudentIdKeys.join(
              ', '
            )}</strong>. Please check again!`
          );
        }
        const errorsKeys = _.keyBy(errors, 'error');
        if (errors.length === 0) {
          setSelectedFile(file);
          return;
        }

        const details = () => {
          if (errorsKeys['Grade must be between 0 and 10']) {
            return 'Grade must be between 0 and 10';
          }

          if (errorsKeys['Student ID must be between 0 and 10 characters']) {
            return 'Student ID must be between 0 and 10 characters';
          }

          if (
            errorsKeys.invalid &&
            errorsKeys.invalid.reason === 'not_a_number'
          ) {
            return `Grade must be a number at row ${errorsKeys.invalid.row} in column ${errorsKeys.invalid.column}`;
          }

          if (errorsKeys.required) {
            return `Field is missing at row ${errorsKeys.required.row} in column '${errorsKeys.required.column}'`;
          }
        };

        notification.error({
          message: 'File Validation Error',
          description: (
            <div>
              Your file is not valid. Please make sure you download our template
              file and follow the format. <br />
              <span className="text-red-400">Detail: {details()}</span>
            </div>
          ),
        });
      })
      .catch((readExcelError: Error) => {
        notification.error({
          message: 'File Validation Error',
          description: (
            <div dangerouslySetInnerHTML={{ __html: readExcelError.message }} />
          ),
        });
      });
  };

  const handleCancel = () => {
    setError(null);
    setSelectedFile(null);
    setOpen(false);
    form.resetFields();
  };

  const handleImport = () => {
    if (!selectedFile) {
      notification.error({
        message: 'No file selected',
        description: 'Please select a file to import',
      });
    }
    const columnId = form.getFieldValue('column');
    if (!selectedFile || !classId || !columnId) {
      return;
    }
    setImportLoading(true);

    ClassGradeService.importOneColumn({
      columnId,
      classId,
      file: selectedFile,
    })
      .then(async (res) => {
        await onSuccess();
        const colName = columns.find((col) => col.id === columnId)?.name;
        notification.success({
          message: 'Import Column Success',
          description: "Grade of '' has been imported successfully",
        });
      })
      .catch((importError: Error) => {
        notification.error({
          message: 'Import Column Error',
          description: importError.message,
        });
      })
      .finally(() => {
        setImportLoading(false);
      });
  };

  const handleDownloadTemplate = () => {
    const columnId = form.getFieldValue('column');
    if (!classId || !columnId) {
      return;
    }

    ClassGradeService.getOneColumnTemplate({
      columnId,
      classId,
      file_type: 'xlsx',
    }).then((response) => {
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
        actualFileName ?? `grade_template.${fileTypes[0]}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };
  // ------------------------------------------------------
  const getImageRepresent = (fileName: string) => {
    if (fileName.endsWith('.xlsx')) {
      return XLSXIcon;
    }

    if (fileName.endsWith('.csv')) {
      return CSVIcon;
    }

    return '';
  };

  // ------------------------------------------------------
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      destroyOnClose
      centered
      footer={null}
    >
      <div className="text-center flex flex-col items-center justify-center">
        <span className="text-base font-semibold">Import One Column</span>
        <Divider className="mt-2 mb-0" />
        <Form className="w-full mt-4" form={form} layout="vertical">
          <Form.Item
            tooltip="What column do you want to import grade?"
            name="column"
            label="Select Grade Column"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select grade column" allowClear>
              {columns.map((column: GradeColumn) => (
                <Select.Option key={column.id} value={column.id}>
                  {column.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div
          className={`h-fit w-full rounded-xl mb-4 flex justify-center border-dashed  ${
            error ? 'border-red-500' : 'border-indigo-600'
          }`}
        >
          {selectedFile ? (
            <div className="py-4 w-[90%] h-full">
              <div className="flex-none bg-[#b4e4ff] rounded-xl flex flex-row justify-between items-center px-4 py-2">
                <img
                  src={getImageRepresent(selectedFile.name)}
                  alt=""
                  style={{ objectFit: 'contain', maxWidth: '50px' }}
                />
                <div className="truncate mx-4 py-4 flex-1 text-left text-base font-medium text-[#344767]">
                  <div>{selectedFile?.name}</div>
                  <div>{formatBytes(selectedFile?.size)}</div>
                </div>
                <button
                  className="flex-none twp !w-[40px] h-[40px] text-red-500 justify-center items-center rounded-full bg-[#f5f5f5] hover:bg-gray-200"
                  onClick={() => {
                    setSelectedFile(null);
                    setError(null);
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>
          ) : (
            <FileUploader
              disabled={!hasSelectedColumn}
              required
              name="file"
              classes={
                hasSelectedColumn
                  ? 'w-full py-4 hover:opacity-[.6]'
                  : 'w-full py-4  bg-gray-300 rounded-xl cursor-not-allowed'
              }
              hoverTitle=" "
              types={fileTypes}
              handleChange={handleFileChange}
              maxSize={1}
              onTypeError={(typeError: any) => {
                setError(typeError);
                notification.error({
                  duration: 2,
                  message: 'File type error',
                  description: 'Please upload a valid file type (.xlsx, .csv)',
                  onClose() {
                    setError(null);
                  },
                });
              }}
              onSizeError={(sizeError: any) => {
                setError(sizeError);
                notification.error({
                  duration: 2,
                  message: 'File size error',
                  description: 'Please upload a file smaller than 1MB',
                  onClose() {
                    setError(null);
                  },
                });
              }}
            >
              <div className="flex flex-col justify-center items-center gap-y-4">
                <img
                  className="w-[3rem] h-[3rem]"
                  src={ImportFileImg}
                  alt="import file"
                />
                <span className="text-base w-full">
                  Drag and drop file{' '}
                  <strong>
                    ({fileTypes.map((type) => `.${type}`).join(', ')})
                  </strong>{' '}
                  here <br /> or
                </span>

                <button
                  disabled={!hasSelectedColumn}
                  className={
                    'twp px-6 py-2 rounded-md text-white bg-[#fb8c00] drop-shadow-md disabled:cursor-not-allowed disabled:bg-gray-500'
                  }
                >
                  Select File
                </button>
                <span>
                  Max file size is: <strong>1MB</strong>
                </span>
              </div>
            </FileUploader>
          )}
        </div>
        <Tooltip title="Click here to download the template file.">
          <button
            disabled={!hasSelectedColumn}
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
        <div className="mt-4 flex flex-row gap-x-4">
          <button
            className="twp px-4 py-2 rounded-md text-white bg-red-500 drop-shadow-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <Button
            disabled={!selectedFile}
            loading={importLoading}
            onClick={handleImport}
            className={
              'twp h-full px-4 py-2 rounded-md text-white !hover:text-white bg-blue-500 drop-shadow-md disabled:bg-gray-400/80 disabled:cursor-not-allowed'
            }
          >
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImportOneColumnModal;
