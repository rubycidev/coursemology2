import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import AceEditorField from 'lib/components/form/fields/AceEditorField';

import { fileShape } from '../propTypes';

import ProgrammingFileDownloadLink from './answers/Programming/ProgrammingFileDownloadLink';

const Editor = (props) => {
  const { file, fieldName, language } = props;
  const { control } = useFormContext();

  return (
    <>
      <ProgrammingFileDownloadLink file={file} />
      <Controller
        control={control}
        name={fieldName}
        render={({ field }) => (
          <AceEditorField
            editorProps={{ $blockScrolling: true }}
            field={field}
            filename={file.filename}
            maxLines={25}
            minLines={25}
            mode={language}
            readOnly={false}
            setOptions={{ useSoftTabs: true }}
            style={{ marginBottom: 10 }}
            theme="github"
            width="100%"
          />
        )}
      />
    </>
  );
};

Editor.propTypes = {
  fieldName: PropTypes.string.isRequired,
  file: PropTypes.shape(fileShape).isRequired,
  language: PropTypes.string.isRequired,
};

export default Editor;
