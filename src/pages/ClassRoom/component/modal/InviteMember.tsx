/* eslint-disable max-lines-per-function */
import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Tooltip,
} from 'antd';
import { useMemo, useState } from 'react';

import { useSearchEmails } from '@/app/store/server/features/users/queries';
import useDebounce from '@/hooks/useDebounce';
import useClassDetail from '@/hooks/useClassDetail';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useInviteMembers } from '@/app/store/server/features/classroom/mutations';

interface InviteMemberProps {
  isInviteTeacher?: boolean;
}

function InviteMember({ isInviteTeacher = false }: InviteMemberProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [searchText, setSearchText] = useState('');

  const debouncedSearchQuery = useDebounce(searchText, 600);
  const {
    data: emailsSearchResult,
    isLoading,
    isFetching,
  } = useSearchEmails({
    email: debouncedSearchQuery,
    role: isInviteTeacher ? USER_ROLE.Teacher : USER_ROLE.Student,
  });
  const { data: classDetail } = useClassDetail();

  const { mutate: inviteMemberMutation, isPending } = useInviteMembers();

  const onSubmit = ({ emails }: { emails: string[] }) => {
    if (!classDetail) {
      return;
    }

    inviteMemberMutation(
      {
        invited_emails: emails,
        code: classDetail?.code,
      },
      {
        onSuccess() {
          setVisible(false);
          form.resetFields();
          message.success(
            `Invitation has been sent to ${emails.length} ${
              isInviteTeacher ? 'teachers' : 'students'
            }`
          );
        },
        onError(error) {
          message.error(
            error.message ??
              `Failed to send invitation to ${emails.length} ${
                isInviteTeacher ? 'teachers' : 'students'
              }`
          );
        },
      }
    );
  };

  const options: SelectProps['options'] = useMemo(() => {
    if (emailsSearchResult?.emails) {
      return emailsSearchResult.emails
        .filter((email) => {
          // Filter out emails that are already in the class
          const isInClass = [
            classDetail?.owner,
            ...(classDetail?.teachers ?? []),
            ...(classDetail?.students ?? []),
          ].some((user) => user?.email === email);

          return !isInClass;
        })
        .map((email) => ({
          label: email,
          value: email,
        }));
    }
  }, [emailsSearchResult, classDetail]);

  const handleTextChange = (value: string) => {
    setSearchText(value);
  };

  const handleChange = (value: string[]) => {
    form
      .validateFields()
      .then(() => {
        setSubmitDisabled(false);
      })
      .catch(() => {
        setSubmitDisabled(true);
      });
  };

  const modalTitle = () => {
    const title = `Invite ${isInviteTeacher ? 'Teachers' : 'Students'}`;
    return title;
  };

  return (
    <>
      <button
        className="twp hover:bg-blue-50 rounded-full w-[48px] h-[48px] flex justify-center items-center"
        onClick={() => {
          setVisible(true);
        }}
      >
        <UserAddOutlined className="text-inherit text-[24px]" />
      </button>
      {visible && (
        <Modal
          open={visible}
          title={modalTitle()}
          okText="Send Invite"
          cancelText="Cancel"
          onCancel={() => {
            setVisible(false);
            form.resetFields();
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isPending}
              disabled={submitDisabled}
              onClick={() => {
                form.validateFields().then((values) => {
                  onSubmit(values);
                });
              }}
            >
              Submit
            </Button>,
          ]}
        >
          {!isInviteTeacher && (
            <div className="flex flex-row my-4">
              <div className="flex flex-col flex-1">
                <span className="twp font-medium text-md">Invitation Link</span>
                <span className="text-gray-500 line-clamp-1">
                  {classDetail?.public_invitation_link}
                </span>
              </div>
              <Tooltip title="Copy invitation link">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      classDetail?.public_invitation_link ?? ''
                    );
                    message.success('Copied to clipboard');
                  }}
                  className="twp hover:bg-blue-50 rounded-full w-[48px] h-[48px] flex justify-center items-center "
                >
                  <CopyOutlined className="text-[rgb(25,103,210)] text-[24px]" />
                </button>
              </Tooltip>
            </div>
          )}
          <Form
            form={form}
            layout="vertical"
            name="form_invite"
            initialValues={{
              email: [],
            }}
          >
            <Form.Item
              label="Emails"
              name="emails"
              rules={[
                {
                  required: true,
                  message: '',
                },
                () => ({
                  validator(_, value) {
                    const validateEmail = (email: string) =>
                      email.match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      );
                    if (
                      Array.isArray(value) &&
                      value.some((email) => !validateEmail(email))
                    ) {
                      return Promise.reject(
                        new Error('Please enter a valid email address')
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                loading={isLoading || isFetching}
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Please select emails or enter email address"
                onSearch={handleTextChange}
                onChange={handleChange}
                tokenSeparators={[',']}
                options={options}
              />
            </Form.Item>
          </Form>
          {isInviteTeacher && (
            <div>
              <p className="text-md text-gray-500">
                The teacher you invite will be able to do as much as you can but
                does not have the ability to delete class.
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default InviteMember;
