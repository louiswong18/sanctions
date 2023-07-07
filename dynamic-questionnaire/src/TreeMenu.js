import React from "react";
import "./TreeMenu.css";

const TreeMenu = ({ data, activeQuestionId }) => (
  <nav className="tree-menu">
    {data.map((section) => (
      <ul key={section.section}>
        <li>Section {section.section}</li>
        <ul>
          {section.questions.map((question) => (
            <li
              key={question.questionId}
              className={
                activeQuestionId === question.questionId
                  ? "active-question"
                  : ""
              }
            >
              {question.text}
            </li>
          ))}
        </ul>
      </ul>
    ))}
  </nav>
);

export default TreeMenu;