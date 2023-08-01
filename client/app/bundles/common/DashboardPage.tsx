import { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';
import { Avatar, Typography } from '@mui/material';
import moment from 'moment';

import SearchField from 'lib/components/core/fields/SearchField';
import Page from 'lib/components/core/layouts/Page';
import Link from 'lib/components/core/Link';
import { useAppContext } from 'lib/containers/AppContainer';
import useTranslation from 'lib/hooks/useTranslation';

const translations = defineMessages({
  searchCourses: {
    id: 'lib.components.navigation.CourseSwitcherPopupMenu.searchCourses',
    defaultMessage: 'Search your courses',
  },
  jumpBackIn: {
    id: 'lib.components.navigation.CourseSwitcherPopupMenu.jumpBackIn',
    defaultMessage: 'Jump back in',
  },
  lastAccessed: {
    id: 'lib.components.navigation.CourseSwitcherPopupMenu.lastAccessed',
    defaultMessage: 'Last accessed {at}',
  },
  noCoursesMatch: {
    id: 'lib.components.navigation.CourseSwitcherPopupMenu.noCoursesMatch',
    defaultMessage: "Oops, no courses matched ''{keyword}''.",
  },
});

const DashboardPage = (): JSX.Element => {
  const { courses } = useAppContext();

  const { t } = useTranslation();

  const [filterKeyword, setFilterKeyword] = useState('');

  const sortedCourses = useMemo(() => {
    return courses?.slice().sort((a, b) => {
      return moment(b.lastActiveAt).diff(moment(a.lastActiveAt));
    });
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!filterKeyword) return sortedCourses;

    return sortedCourses?.filter((course) =>
      course.title.toLowerCase().includes(filterKeyword.toLocaleLowerCase()),
    );
  }, [filterKeyword]);

  return (
    <Page className="m-auto flex max-w-7xl flex-col justify-center space-y-7 pt-24">
      <Typography className="max-w-7xl" variant="h4">
        {t(translations.jumpBackIn)}
      </Typography>

      <SearchField
        autoFocus
        onChangeKeyword={setFilterKeyword}
        placeholder={t(translations.searchCourses)}
      />

      {Boolean(courses?.length) && (
        <section className="flex flex-col space-y-5">
          {filteredCourses?.map((course) => (
            <Link
              key={course.id}
              className="group flex items-center justify-between rounded-xl border border-solid border-neutral-200 p-5 transition-transform hover:bg-neutral-100 active:scale-95 active:bg-neutral-200"
              color="inherit"
              to={course.url}
              underline="none"
            >
              <div className="flex space-x-5">
                <Avatar
                  alt={course.title}
                  className="wh-20"
                  src={course.logoUrl}
                  variant="rounded"
                />

                <div className="flex flex-col justify-center">
                  <Typography variant="body1">{course.title}</Typography>

                  {course.lastActiveAt && (
                    <Typography color="text.secondary" variant="body2">
                      {t(translations.lastAccessed, {
                        at: moment(course.lastActiveAt).fromNow(),
                      })}
                    </Typography>
                  )}
                </div>
              </div>

              <ArrowForward
                className="invisible group-hover:visible"
                color="primary"
              />
            </Link>
          ))}

          {!filteredCourses?.length && (
            <Typography color="text.secondary">
              {t(translations.noCoursesMatch, {
                keyword: filterKeyword,
              })}
            </Typography>
          )}
        </section>
      )}
    </Page>
  );
};

const DashboardPageRedirects = (): JSX.Element => {
  const { courses } = useAppContext();

  if (!courses?.length) return <Navigate to="/courses" />;

  if (courses?.length === 1) return <Navigate to={courses[0].url} />;

  return <DashboardPage />;
};

export default DashboardPageRedirects;
