import { FC, lazy, Suspense, useEffect, useState } from 'react';
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircleOutline,
  PendingOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';
import { Card, CardContent, CardHeader, Link } from '@mui/material';
import { CommentStatusTypes, CommentTopicEntity } from 'types/course/comments';
import { AppDispatch, AppState } from 'types/store';

import { getCourseUserURL } from 'lib/helpers/url-builders';
import { getCourseId } from 'lib/helpers/url-helpers';

import { updatePending, updateRead } from '../../operations';
import { getAllCommentPostMiniEntities } from '../../selectors';

import CodaveriCommentCard from './CodaveriCommentCard';
import CommentCard from './CommentCard';

const CommentField = lazy(
  () =>
    import(
      /* webpackChunkName: "discussionComment" */ '../fields/CommentField'
    ),
);

interface Props extends WrappedComponentProps {
  topic: CommentTopicEntity;
}

const translations = defineMessages({
  by: {
    id: 'course.discussion.topics.TopicCard.by',
    defaultMessage: 'By',
  },
  pendingStatus: {
    id: 'course.discussion.topics.TopicCard.pendingStatus',
    defaultMessage: 'Unmark as Pending',
  },
  notPendingStatus: {
    id: 'course.discussion.topics.TopicCard.notPendingStatus',
    defaultMessage: 'Mark as Pending',
  },
  unreadStatus: {
    id: 'course.discussion.topics.TopicCard.unreadStatus',
    defaultMessage: 'Mark as Read',
  },
  loadingStatus: {
    id: 'course.discussion.topics.TopicCard.loading',
    defaultMessage: 'Loading...',
  },
  loadingComment: {
    id: 'course.discussion.topics.TopicCard.loadingComment',
    defaultMessage: 'Loading comment field...',
  },
});

const TopicCard: FC<Props> = (props) => {
  const { intl, topic } = props;
  const dispatch = useDispatch<AppDispatch>();
  const postListData = useSelector((state: AppState) =>
    getAllCommentPostMiniEntities(state),
  ).filter((post) => post.topicId === topic.id);
  const [status, setStatus] = useState(CommentStatusTypes.loading);

  useEffect(() => {
    if (topic.topicPermissions.canTogglePending) {
      const isPending = topic.topicSettings.isPending;
      const newStatus = isPending
        ? CommentStatusTypes.pending
        : CommentStatusTypes.notPending;
      setStatus(newStatus);
    } else if (topic.topicPermissions.canMarkAsRead) {
      const isUnread = topic.topicSettings.isUnread;
      const newStatus = isUnread
        ? CommentStatusTypes.unread
        : CommentStatusTypes.read;
      setStatus(newStatus);
    }
  }, [topic]);

  if (postListData.length === 0) {
    return null;
  }

  const onClickPending = (id: number): void => {
    if (status !== CommentStatusTypes.loading) {
      const newStatus =
        status === CommentStatusTypes.pending
          ? CommentStatusTypes.notPending
          : CommentStatusTypes.pending;
      setStatus(CommentStatusTypes.loading);
      dispatch(updatePending(id)).then(() => {
        setStatus(newStatus);
      });
    }
  };

  const onClickRead = (id: number): void => {
    if (status !== CommentStatusTypes.loading) {
      const newStatus =
        status === CommentStatusTypes.read
          ? CommentStatusTypes.unread
          : CommentStatusTypes.read;
      setStatus(CommentStatusTypes.loading);
      dispatch(updateRead(id)).then(() => {
        setStatus(newStatus);
      });
    }
  };

  const updateStatus = (): void => {
    if (status === CommentStatusTypes.unread) {
      setStatus(CommentStatusTypes.read);
    } else if (status === CommentStatusTypes.pending) {
      setStatus(CommentStatusTypes.notPending);
    }
  };

  const renderStatus = (): JSX.Element | null => {
    switch (status) {
      case CommentStatusTypes.loading:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PendingOutlined />
            {intl.formatMessage(translations.loadingStatus)}
          </div>
        );
      case CommentStatusTypes.pending:
        return (
          <Link
            className="clickable"
            id={`mark-as-pending-${topic.id}`}
            onClick={(): void => onClickPending(topic.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <ScheduleOutlined />
            {intl.formatMessage(translations.pendingStatus)}
          </Link>
        );
      case CommentStatusTypes.notPending:
        return (
          <Link
            className="clickable"
            id={`unmark-as-pending-${topic.id}`}
            onClick={(): void => onClickPending(topic.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <CheckCircleOutline />
            {intl.formatMessage(translations.notPendingStatus)}
          </Link>
        );
      case CommentStatusTypes.read:
        return null;
      case CommentStatusTypes.unread:
        return (
          <Link
            className="clickable"
            id={`mark-as-read-${topic.id}`}
            onClick={(): void => onClickRead(topic.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <CheckCircleOutline />
            {intl.formatMessage(translations.unreadStatus)}
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader
        style={{ paddingBottom: '0px' }}
        subheader={
          <>
            <div>{renderStatus()}</div>
            <div>
              {`${intl.formatMessage(translations.by)}: `}
              <a href={getCourseUserURL(getCourseId(), topic.creator.id)}>
                {topic.creator.name}
              </a>
            </div>
          </>
        }
        title={
          <a
            className={`topic-${topic.id}`}
            href={topic.links.titleLink}
            id={`topic-${topic.id}-${
              topic.timestamp?.toString().replaceAll(':', '-') ?? ''
            }`}
          >
            {topic.timestamp
              ? `${topic.title}: ${topic.timestamp.toString()}`
              : topic.title}
          </a>
        }
      />
      <CardContent>
        {topic.content && (
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        )}
        {postListData.map((post) => {
          return (
            <div key={post.id}>
              {post.codaveriFeedback &&
              post.codaveriFeedback.status === 'pending_review' ? (
                <CodaveriCommentCard post={post} />
              ) : (
                <CommentCard post={post} />
              )}
            </div>
          );
        })}
        {/* Dont need to render the comment field when the last post (which is 
          the intended post to be shown) is of codaveri feedback type */}
        {!postListData[postListData.length - 1]?.codaveriFeedback && (
          <Suspense
            fallback={
              <div
                style={{
                  marginTop: 10,
                }}
              >
                {intl.formatMessage(translations.loadingComment)}
              </div>
            }
          >
            <CommentField topic={topic} updateStatus={updateStatus} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
};

export default injectIntl(TopicCard);
