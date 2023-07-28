"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface VocabularyProps {
  kanjiList: string[];
}

const Vocabulary: React.FC<VocabularyProps> = ({ kanjiList }) => {
  const [kanjiData, setKanjiData] = useState<any[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchKanjiData = async () => {
      // ! I am getting ALL the kanji
      // const newData = await Promise.all(
      //   kanjiList.map(async (kanji) => {
      //     const response = await axios.get(
      //       `https://api.wanikani.com/v2/subjects?types=kanji&characters=${kanji}`,
      //       {
      //         headers: {
      //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_WANIKANI_KEY}`,
      //         },
      //       }
      //     );
      //     return response.data.data[0].data;
      //   })
      // );
      // setKanjiData(newData);
    };

    fetchKanjiData();
  }, [kanjiList]);

  return (
    <div className="w-3/12">
      <h2>Vocabulary List</h2>
      <ul></ul>
    </div>
  );
};

export default Vocabulary;
