import React from "react";
import "./QuestionnaireComponent.css";
import Questionnaire from "./Questionnaire";

const QuestionnaireComponent = ({ data, setActiveQuestionId }) => {
  return (
    <div className="questionnaire">
      <Questionnaire data={data} setActiveQuestionId={setActiveQuestionId} />
    </div>
  );
};

export default QuestionnaireComponent;