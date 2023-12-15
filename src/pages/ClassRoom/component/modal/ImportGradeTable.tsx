/* eslint-disable max-lines-per-function */
import { CloseOutlined } from '@ant-design/icons';
import { App, Divider, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useParams } from 'react-router-dom';

import readXlsxFile, { Integer, Schema } from 'read-excel-file';
import _ from 'lodash';

import { useQueryClient } from '@tanstack/react-query';

import PreviewGradeBoardModal from './PreviewGradeBoardModal';

import ImportFileImg from '@/assets/import-file.png';
import ExcelIconImg from '@/assets/excel.png';
import XLSXIcon from '@/assets/xlsx_ext.png';
import CSVIcon from '@/assets/csv_ext.png';
import ClassGradeService from '@/services/ClassGradeService';
import { formatBytes, getFileNameFromContentDisposition } from '@/utils/index';
import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';

const fileTypes = ['xlsx'];

interface ImportGradeTableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ImportGradeTable({ open, setOpen }: ImportGradeTableProps) {
  const { notification } = App.useApp();
  const { id: classId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const [xlsxSchema, setXlsxSchema] = useState<Schema>({});
  const [tableDataSource, setTableDataSource] = useState<any[]>([]);

  const { data: classGrade } = useGetClassGrades(classId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (classGrade.grade_columns) {
      setXlsxSchema({
        'Student ID': {
          prop: 'student_id',
          type: String,
          required: true,
        },
        'Full name': {
          prop: 'full_name',
          type: String,
          required: true,
        },
        ...classGrade.grade_columns.reduce((acc: any, col: any) => {
          acc[col.name] = {
            prop: col.name,
            type: Integer,
            required: true,
            validate(value: number) {
              if (value > 10 || value < 0) {
                throw new Error('Grade must be between 0 and 10');
              }
            },
          };
          return acc;
        }, {}),
      });
    }
  }, [classGrade.grade_columns]);

  const handleFileChange = (file: File) => {
    readXlsxFile(file, {
      schema: xlsxSchema,
      transformData(dataExcel: any[]) {
        const headerRow = dataExcel[0];
        if (headerRow.length - 2 !== classGrade.grade_columns.length) {
          throw new Error(
            'Your file is not valid. The columns in your file does not match the columns in the template file.'
          );
        }

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
          setTableDataSource(rows);
          setSelectedFile(file);
          return;
        }

        const details = () => {
          if (errorsKeys['Grade must be between 0 and 10']) {
            return 'Grade must be between 0 and 10';
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

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['class-grades', classId],
    });
    setError(null);
    setSelectedFile(null);
    setOpen(false);
    setShowPreview(false);
  };

  const handleCancel = () => {
    setError(null);
    setSelectedFile(null);
    setOpen(false);
    setShowPreview(false);
  };

  const handlePreview = () => {
    if (!selectedFile) {
      notification.error({
        message: 'No file selected',
        description: 'Please select a file to import',
      });
    }
    if (selectedFile && classId) {
      setOpen(false);
      setShowPreview(true);
    }
  };

  const handleDownloadTemplate = () => {
    if (!classId) {
      return;
    }
    ClassGradeService.getGradeTemplate({
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

  const getImageRepresent = (fileName: string) => {
    if (fileName.endsWith('.xlsx')) {
      return XLSXIcon;
    }

    if (fileName.endsWith('.csv')) {
      return CSVIcon;
    }

    return '';
  };

  return (
    <>
      <Modal open={open} onCancel={handleCancel} footer={<></>}>
        <div className="text-center flex flex-col items-center justify-center">
          <span className="text-base font-semibold">Import Grade</span>
          <Divider className="mt-2 mb-0" />
          <div
            className={`h-fit w-full rounded-xl my-4 flex justify-center border-dashed  ${
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
                      setTableDataSource([]);
                      setShowPreview(false);
                    }}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </div>
            ) : (
              <FileUploader
                required
                name="file"
                classes={'w-full py-4  hover:opacity-[.6] '}
                hoverTitle=" "
                types={fileTypes}
                handleChange={handleFileChange}
                maxSize={1}
                onTypeError={(typeError: any) => {
                  setError(typeError);
                  notification.error({
                    duration: 2,
                    message: 'File type error',
                    description:
                      'Please upload a valid file type (.xlsx, .csv)',
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
                    className={
                      'twp px-6 py-2 rounded-md text-white bg-[#fb8c00] drop-shadow-md'
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
              className={
                'twp px-4 py-2 rounded-md flex flex-row items-center border-2 border-gray-200 hover:opacity-[.75]'
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
            <button
              disabled={!selectedFile}
              onClick={handlePreview}
              className={
                'twp px-4 py-2 rounded-md text-white bg-blue-500 drop-shadow-md disabled:bg-gray-400/80 disabled:cursor-not-allowed'
              }
            >
              Preview
            </button>
          </div>
        </div>
      </Modal>

      {showPreview && (
        <PreviewGradeBoardModal
          open={showPreview}
          setOpen={setShowPreview}
          onCancel={handleCancel}
          onSuccess={onSuccess}
          dataSource={tableDataSource ?? []}
          gradeColumns={classGrade.grade_columns ?? []}
          file={selectedFile}
        />
      )}
    </>
  );
}

export default ImportGradeTable;
