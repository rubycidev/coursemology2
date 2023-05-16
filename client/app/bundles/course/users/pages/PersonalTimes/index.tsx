import { FC, useEffect, useState } from 'react';
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl';
import { toast } from 'react-toastify';
import { Paper, Typography } from '@mui/material';

import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import PageHeader from 'lib/components/navigation/PageHeader';
import { useAppDispatch, useAppSelector } from 'lib/hooks/store';

import SelectCourseUser from '../../components/misc/SelectCourseUser';
import UserManagementTabs from '../../components/navigation/UserManagementTabs';
import { fetchUsers } from '../../operations';
import {
  getManageCourseUserPermissions,
  getManageCourseUsersSharedData,
} from '../../selectors';

type Props = WrappedComponentProps;

const translations = defineMessages({
  manageUsersHeader: {
    id: 'course.users.PersonalTimes.manageUsersHeader',
    defaultMessage: 'Manage Users',
  },
  fetchUsersFailure: {
    id: 'course.users.PersonalTimes.fetchUsersFailure',
    defaultMessage: 'Failed to fetch users',
  },
  courseUserHeader: {
    id: 'course.users.PersonalTimes.courseUserHeader',
    defaultMessage: 'Course User',
  },
});

const PersonalTimes: FC<Props> = (props) => {
  const { intl } = props;
  const [isLoading, setIsLoading] = useState(true);
  const permissions = useAppSelector(getManageCourseUserPermissions);
  const sharedData = useAppSelector(getManageCourseUsersSharedData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers(true))
      .finally(() => {
        setIsLoading(false);
      })
      .catch(() =>
        toast.error(intl.formatMessage(translations.fetchUsersFailure)),
      );
  }, [dispatch]);

  return (
    <>
      <PageHeader title={intl.formatMessage(translations.manageUsersHeader)} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <UserManagementTabs
            permissions={permissions}
            sharedData={sharedData}
          />
          <Paper
            elevation={3}
            sx={{ padding: '12px 24px 24px 24px', margin: '12px 0px' }}
          >
            <Typography sx={{ marginBottom: '24px' }} variant="h6">
              {intl.formatMessage(translations.courseUserHeader)}
            </Typography>

            <SelectCourseUser />
          </Paper>
        </>
      )}
    </>
  );
};

export default injectIntl(PersonalTimes);
