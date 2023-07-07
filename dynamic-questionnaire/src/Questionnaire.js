import React, { useState, useEffect, useCallback } from 'react';
import './Questionnaire.css';

const Question = ({ question, answer, setAnswer, disabled }) => {
  const handleChange = (e) => {
    setAnswer(question.questionId, e.target.value);
  };

  return (
    <div className="question">
      <label htmlFor={`question_${question.questionId}`}>
        {`Question ${question.questionId}: ${question.text}`}
      </label>
      <input
        id={`question_${question.questionId}`}
        type="text"
        value={answer}
        onChange={handleChange}
        disabled={disabled}
        className={disabled ? 'disabled-input' : ''}
      />
    </div>
  );
};

const Questionnaire = ({ data }) => {
  const initialAnswersState = data
    .flatMap((section) => section.questions)
    .reduce((acc, question) => ({ ...acc, [question.questionId]: '' }), {});

  const [answers, setAnswers] = useState(initialAnswersState);
  const [expandedSections, setExpandedSections] = useState([]);
  const [completedSections, setCompletedSections] = useState([]);

  const setAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const isSectionExpanded = useCallback(
    (sectionNumber) => {
      return expandedSections.includes(sectionNumber);
    },
    [expandedSections]
  );

  const toggleSectionExpanded = useCallback((sectionNumber) => {
    setExpandedSections((prevExpandedSections) => {
      if (prevExpandedSections.includes(sectionNumber)) {
        return prevExpandedSections.filter((section) => section !== sectionNumber);
      } else {
        return [...prevExpandedSections, sectionNumber];
      }
    });
  }, []);

  const isSectionCompleted = (sectionNumber) => {
    return completedSections.includes(sectionNumber);
  };

  const hasDependencyMet = useCallback(
    (dependencies) => {
      if (dependencies.length === 0) {
        return true;
      }

      return dependencies.every((dep) => {
        return answers[dep.questionId] === String(dep.answer);
      });
    },
    [answers]
  );

  useEffect(() => {
    const checkSectionCompletion = (sectionNumber) => {
      const sectionQuestions = data.find((section) => section.section === sectionNumber).questions;
      return sectionQuestions.every((question) => {
        // Check if the question is hidden due to unmet dependencies
        const isHidden = !hasDependencyMet(question.dependencies);

        // A section is considered completed if all its visible questions have answers
        return isHidden || (answers[question.questionId] && answers[question.questionId].length > 0);
      });
    };

    const newCompletedSections = data
      .map((section) => section.section)
      .filter((sectionNumber) => checkSectionCompletion(sectionNumber));

    setCompletedSections(newCompletedSections);
  }, [answers, data, hasDependencyMet]);

  useEffect(() => {
    const lastCompletedSection = Math.max(...completedSections);
    if (lastCompletedSection < data.length && !isSectionExpanded(lastCompletedSection + 1)) {
      toggleSectionExpanded(lastCompletedSection + 1);
    }
  }, [completedSections, data, isSectionExpanded, toggleSectionExpanded]);

  useEffect(() => {
    const initialExpandedSections = data
      .filter((section) => section.sectionDependency === undefined)
      .map((section) => section.section);

    setExpandedSections(initialExpandedSections);
  }, [data]);

  return (
    <form className="questionnaire">
      {data.map((section, sectionIndex) => {
        const expanded = isSectionExpanded(section.section);
        const sectionDependencyMet = sectionIndex === 0 || isSectionCompleted(sectionIndex);

        return (
          <div key={section.section}>
            <h2 className="section-title" onClick={() => toggleSectionExpanded(section.section)}>
              {`Section ${section.section}`}
            </h2>
            {expanded && (
              <div>
                {section.questions.map((question) => (
                  <div
                    key={question.questionId}
                    className={`question-wrapper ${
                      hasDependencyMet(question.dependencies) ? 'expanded' : 'collapsed'
                    }`}
                  >
                    <Question
                      question={question}
                      answer={answers[question.questionId]}
                      setAnswer={setAnswer}
                      disabled={!sectionDependencyMet}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </form>
  );
};

export default Questionnaire;