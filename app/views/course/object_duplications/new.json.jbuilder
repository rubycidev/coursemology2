# frozen_string_literal: true
json.currentHost current_tenant.host

json.sourceCourses @source_courses do |course|
  json.(course, :id, :title)
  json.host course.instance.host
end

json.destinationCourses @destination_courses do |course|
  json.(course, :id, :title)
  json.path course_path(course)
  json.host course.instance.host
  json.rootFolder do
    root_folder = @root_folder_map[course.id]
    json.subfolders root_folder.children.map(&:name)
    json.materials root_folder.materials.map(&:name)
  end
  json.enabledComponents enabled_component_tokens(course)
end

json.partial! 'course_duplication_data'
