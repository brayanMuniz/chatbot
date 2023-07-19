interface ChatProps {
  className?: string;
}

export function Chat({ className }: ChatProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center text-lg">
        <p className="py-6">
          User:
          <p>
            <ruby>
              日本語<rt>にほんご</rt>
            </ruby>
            の場合はランダムに生成された文章以外に、著作権が切れた小説などが利用されることもある。
          </p>
        </p>
      </div>
      <hr />
      <div className="flex items-center">
        <p className="py-6">
          Bot:
          日本語の場合はランダムに生成された文章以外に、著作権が切れた小説などが利用されることもある。
        </p>
      </div>
    </div>
  );
}
