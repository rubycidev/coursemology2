import CourseAPI from 'api/course';
import {
  ApproveEnrolRequestPatchData,
  EnrolRequestMiniEntity,
} from 'types/course/enrolRequests';
import { Operation } from 'types/store';
import * as actions from './actions';

const formatAttributes = (
  data: EnrolRequestMiniEntity,
): ApproveEnrolRequestPatchData => {
  const payload = {
    course_user: {
      name: data.name,
      phantom: data.phantom, // undefined if user doesn't change
      role: data.role, // undefined if user doesn't change
      timeline_algorithm: data.timelineAlgorithm, // undefined if user doesn't change
    },
  };
  return payload;
};

export function fetchEnrolRequests(): Operation<void> {
  return async (dispatch) =>
    CourseAPI.enrolRequests
      .index()
      .then((response) => {
        const data = response.data;
        dispatch(
          actions.saveEnrolRequestList(
            data.enrolRequests,
            data.permissions,
            data.manageCourseUsersData,
          ),
        );
      })
      .catch((error) => {
        throw error;
      });
}

export function approveEnrolRequest(
  enrolRequest: EnrolRequestMiniEntity,
): Operation<void> {
  return async (dispatch) =>
    CourseAPI.enrolRequests
      .approve(formatAttributes(enrolRequest), enrolRequest.id)
      .then((response) => {
        const enrolRequestToUpdate = response.data;
        dispatch(actions.updateEnrolRequest(enrolRequestToUpdate));
      })
      .catch((error) => {
        throw error;
      });
}

export function rejectEnrolRequest(requestId: number): Operation<void> {
  return async (dispatch) =>
    CourseAPI.enrolRequests
      .reject(requestId)
      .then((response) => {
        const enrolRequest = response.data;
        dispatch(actions.updateEnrolRequest(enrolRequest));
      })
      .catch((error) => {
        throw error;
      });
}
