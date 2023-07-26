import React from "react";

interface VocabularyProps {
  kanjiList: string[];
}

const Vocabulary: React.FC<VocabularyProps> = ({ kanjiList }) => {
  return (
    <div className="w-3/12">
      <h2>Vocabulary List</h2>
      <ul>
        {kanjiList.map((kanji, index) => (
          <li key={index}>{kanji}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vocabulary;
