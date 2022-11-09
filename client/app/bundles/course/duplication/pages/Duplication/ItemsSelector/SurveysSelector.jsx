import { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { ListSubheader } from '@mui/material';
import PropTypes from 'prop-types';

import { setItemSelectedBoolean } from 'course/duplication/actions';
import BulkSelectors from 'course/duplication/components/BulkSelectors';
import IndentedCheckbox from 'course/duplication/components/IndentedCheckbox';
import TypeBadge from 'course/duplication/components/TypeBadge';
import UnpublishedIcon from 'course/duplication/components/UnpublishedIcon';
import { duplicableItemTypes } from 'course/duplication/constants';
import { surveyShape } from 'course/duplication/propTypes';
import { defaultComponentTitles } from 'course/translations.intl';

const translations = defineMessages({
  noItems: {
    id: 'course.duplication.SurveysSelector.noItems',
    defaultMessage: 'There are no surveys to duplicate.',
  },
});

class SurveysSelector extends Component {
  setAllSurveysSelection = (value) => {
    const { dispatch, surveys } = this.props;

    surveys.forEach((survey) => {
      dispatch(
        setItemSelectedBoolean(duplicableItemTypes.SURVEY, survey.id, value),
      );
    });
  };

  renderBody() {
    const { surveys } = this.props;

    if (surveys.length < 1) {
      return (
        <ListSubheader disableSticky={true}>
          <FormattedMessage {...translations.noItems} />
        </ListSubheader>
      );
    }

    return (
      <>
        {surveys.length > 1 ? (
          <BulkSelectors
            callback={this.setAllSurveysSelection}
            styles={{ selectLink: { marginLeft: 0 } }}
          />
        ) : null}
        {surveys.map((survey) => this.renderRow(survey))}
      </>
    );
  }

  renderRow(survey) {
    const { dispatch, selectedItems } = this.props;
    const checked = !!selectedItems[duplicableItemTypes.SURVEY][survey.id];
    const label = (
      <span style={{ display: 'flex', alignItems: 'centre' }}>
        <TypeBadge itemType={duplicableItemTypes.SURVEY} />
        {survey.published || <UnpublishedIcon />}
        {survey.title}
      </span>
    );

    return (
      <IndentedCheckbox
        key={survey.id}
        checked={checked}
        label={label}
        onChange={(e, value) =>
          dispatch(
            setItemSelectedBoolean(
              duplicableItemTypes.SURVEY,
              survey.id,
              value,
            ),
          )
        }
      />
    );
  }

  render() {
    const { surveys } = this.props;
    if (!surveys) {
      return null;
    }

    return (
      <>
        <h2>
          <FormattedMessage
            {...defaultComponentTitles.course_survey_component}
          />
        </h2>
        {this.renderBody()}
      </>
    );
  }
}

SurveysSelector.propTypes = {
  surveys: PropTypes.arrayOf(surveyShape),
  selectedItems: PropTypes.shape({}),

  dispatch: PropTypes.func.isRequired,
};

export default connect(({ duplication }) => ({
  surveys: duplication.surveyComponent,
  selectedItems: duplication.selectedItems,
}))(SurveysSelector);
