# frozen_string_literal: true
json.call(survey, :id, :title, :base_exp, :time_bonus_exp, :published,
          :anonymous, :allow_response_after_end, :allow_modify_after_submit, :has_todo)

can_manage_survey = can?(:manage, survey)

json.start_at survey_time.start_at&.iso8601
json.end_at survey_time.end_at&.iso8601
json.bonus_end_at survey_time.bonus_end_at&.iso8601
json.closing_reminded_at survey.closing_reminded_at&.iso8601
json.description format_ckeditor_rich_text(survey.description)

if can_manage_survey
  json.numberOfStudents @course_students.count
  if @survey_submission_count_hash
    json.submissionCount @survey_submission_count_hash[survey.id]
  else
    json.submissionCount survey.student_submission_count
  end
end

can_update = can?(:update, survey)
json.canUpdate can_update
json.canDelete can?(:destroy, survey)
json.canCreateSection can?(:create, Course::Survey::Section.new(survey: survey))
json.canManage can?(:manage, survey)
json.canRespond can?(:create, Course::Survey::Response.new(survey: survey))
json.hasStudentResponse survey.has_student_response? if can_update

current_user_response = survey.responses.find_by(creator: current_user)
if current_user_response
  json.response do
    json.id current_user_response.id
    json.submitted_at current_user_response.submitted_at&.iso8601
    json.canModify can?(:modify, current_user_response)
    json.canSubmit can?(:submit, current_user_response)
  end
else
  json.response nil
end
