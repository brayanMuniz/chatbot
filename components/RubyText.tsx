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

function katakanaToHiragana(src: string) {
  return src.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

const RubyText: React.FC<RubyTextProps> = ({ text, tokenizer }) => {
  if (!tokenizer) return <>{text}</>;

  const tokens = tokenizer.tokenize(text);
  return (
    <>
      {tokens.map((token, index) => {
        if (token.reading && [...token.surface_form].some(isKanji)) {
          return (
            <ruby key={index}>
              {token.surface_form}
              <rt>{katakanaToHiragana(token.reading)}</rt>
            </ruby>
          );
        } else {
          return token.surface_form;
        }
      })}
    </>
  );
};

export default RubyText;
