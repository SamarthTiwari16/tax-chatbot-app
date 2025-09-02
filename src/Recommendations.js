import React from 'react';
import { marked } from 'marked'; // We'll need to install this library
import './Recommendations.css';

function Recommendations({ text }) {
  if (!text) return null;

  // Convert markdown text from AI to HTML
  const getMarkdownText = () => {
    const rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
  };

  return (
    <div className="recommendations-container">
      <div dangerouslySetInnerHTML={getMarkdownText()} />
    </div>
  );
}

export default Recommendations;