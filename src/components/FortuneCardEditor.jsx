import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function FortuneCardEditor() {
  const [text, setText] = useState(`一、整體運勢分析
流年主數為「3」，象徵變動與新機會。今年要敢變、願變，突破就會來。
二、感情運勢
情感易起波動，先觀察再靠近，別被一時悸動牽著走。
三、工作事業運勢
工作變動多，記得靈活應對，轉個彎可能就是貴人。
四、財富運勢
財運平穩但破財機率高，控制衝動消費是關鍵。
開運水晶指引：
黃水晶助正財，藍虎眼穩定情緒，白水晶守心神、擋雜念。`);

  const [name, setName] = useState("王小明");
  const [font] = useState("FortuneFont");
  const [textColor] = useState("#000000");
  const [bodyFontSize, setBodyFontSize] = useState(1.5);
  const previewRef = useRef(null);

  const handleDownload = async () => {
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      scale: 1
    });
    const link = document.createElement("a");
    link.download = "命理小卡.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // 🆕 GPT 指令複製功能
  const handleCopyPrompt = async () => {
    try {
      const response = await fetch("/gpt.txt");
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      alert("✅ GPT 指令已複製到剪貼簿！");
    } catch (error) {
      alert("❌ 複製失敗，請確認 gpt.txt 是否存在於 public 資料夾！");
    }
  };

  const renderParagraphs = () => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const maxLines = 20;
    const clipped = lines.slice(0, maxLines);

    return clipped.map((line, index) => {
      const isHeading = /^(一、整體運勢分析|二、感情運勢|三、工作事業運勢|四、財富運勢|開運水晶指引[:：]?)$/.test(line.trim());
      return (
        <p
          key={index}
          style={{
            marginTop: "0",
            marginBottom: isHeading ? "0.1rem" : "0.5rem",
            textIndent: isHeading ? "0" : "2em",
            maxWidth: "520px",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
            whiteSpace: "normal",
            fontWeight: "normal",
            fontSize: isHeading
              ? `${(bodyFontSize + 0.2).toFixed(2)}rem`
              : `${bodyFontSize.toFixed(2)}rem`
          }}
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 min-h-screen">
      {/* 左側輸入區 */}
      <div className="w-full md:w-1/2">
        <h2 className="text-lg font-bold mb-2">輸入命理文字</h2>

        <label className="block text-sm font-medium mb-1">受贈者名稱：</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          placeholder="請輸入名字，例如 阿杰、小茵"
        />

        <textarea
          value={text}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\n{2,}/g, "\n");
            setText(cleaned);
          }}
          className="w-full h-96 p-4 border border-gray-300 rounded-xl font-mono text-sm whitespace-pre-wrap"
        />

        {/* 字體大小滑桿 */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            內文字體大小：{bodyFontSize.toFixed(2)}rem
          </label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={bodyFontSize}
            onChange={(e) => setBodyFontSize(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* 複製 GPT 指令按鈕 */}
        <div className="mt-6">
          <button
            onClick={handleCopyPrompt}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            複製 GPT 指令
          </button>
        </div>
      </div>

      {/* 右側卡片預覽區 */}
      <div className="w-full md:w-1/2">
        <h2 className="text-lg font-bold mb-2">命理小卡預覽</h2>
        <div
          ref={previewRef}
          className="mx-auto rounded-xl shadow-md border border-gray-300 overflow-hidden"
          style={{
            fontFamily: font,
            width: "600px",
            height: "900px",
            backgroundImage: 'url("/bg-card.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: "0px",
            paddingLeft: "40px",
            paddingRight: "40px",
            boxSizing: "border-box"
          }}
        >
          {/* 上方標題 */}
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "normal",
              textAlign: "center",
              marginTop: "16px",
              marginBottom: "16px",
              color: textColor,
              textShadow: "0 1px 1px rgba(0,0,0,0.1)"
            }}
          >
            {name} 的流年運勢報告書
          </div>

          {/* 內文段落 */}
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "2",
              textAlign: "left",
              color: textColor,
              textShadow: "0 1px 1px rgba(0,0,0,0.1)",
              maxWidth: "520px",
              margin: "0 auto"
            }}
          >
            {renderParagraphs()}
          </div>
        </div>

        {/* 下載按鈕 */}
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          下載命理小卡
        </button>
      </div>
    </div>
  );
}
