import React from "react";
import kuromoji from "kuromoji";

interface RubyTextProps {
  text: string;
  tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null;
}

const isKanji = (ch: string) => {
  return (
    (ch >= "\u4e00" && ch <= "\u9faf") || // CJK Unified Ideographs
    (ch >= "\u3400" && ch <= "\u4dbf") // CJK Unified Ideographs Extension A
  );
};

const RubyText: React.FC<RubyTextProps> = ({ text, tokenizer }) => {
  if (!tokenizer) return <>{text}</>;

  const tokens = tokenizer.tokenize(text);
  return (
    <>
      {tokens.map((token, index) =>
        token.reading && [...token.surface_form].some(isKanji) ? (
          <ruby key={index}>
            {token.surface_form}
            <rt>{token.reading}</rt>
          </ruby>
        ) : (
          token.surface_form
        )
      )}
    </>
  );
};

export default RubyText;
