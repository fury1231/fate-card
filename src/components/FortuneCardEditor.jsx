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
  const [textColor] = useState("#2f2f2f");
  const [bodyFontSize, setBodyFontSize] = useState(1.5);
  const [titleFontSize, setTitleFontSize] = useState(2.4); // 內文標題字體大小
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
      const isHeading = /^([一二三四五六]、)?(整體運勢|感情婚姻運勢|金錢財富運勢|工作事業運勢|偏財機遇運勢|貴人人緣運勢|整體運勢分析|感情運勢|金錢與偏財運勢|事業與貴人運勢|財富運勢|開運水晶指引[:：]?)$/.test(line.trim());
      return (
        <p
          key={index}
          style={{
            marginTop: "0",
            marginBottom: isHeading ? "0.1rem" : "0.5rem",
            textIndent: 0,
            maxWidth: "520px",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
            whiteSpace: "normal",
            fontWeight: isHeading ? "bold" : "normal",
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
    <div className="flex items-center justify-center min-h-screen bg-[#fdfcfb] text-gray-800 px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        {/* 左側輸入區 */}
        <div className="w-full md:w-1/2 p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">輸入命理內容</h2>
  
          <label className="block text-sm font-semibold mb-1">受贈者姓名：</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-300"
            placeholder="請輸入名字，例如 阿杰、小茵"
          />
          <br/>
          <label className="block text-sm font-semibold mb-1">命理內容：</label>
          {/* <textarea
            value={text}
            onChange={(e) => setText(e.target.value.replace(/\n{2,}/g, "\n"))}
            className="w-[440px] h-[480px] p-4 border border-gray-300 rounded-xl font-mono text-sm whitespace-pre-wrap shadow-inner"
          /> */}
          <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.replace(/\n{2,}/g, "\n"))}
            className="w-full p-4 border border-gray-300 rounded-xl font-mono text-sm whitespace-pre-wrap shadow-inner resize-y overflow-auto"
            style={{
              width: "500px",
              height: "500px", // ✅ 加這個固定初始高度
              boxSizing: "border-box"
            }}
          />
        </div>
        <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">
          標題字體大小：{titleFontSize.toFixed(2)}rem
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.05"
          value={titleFontSize}
          onChange={(e) => setTitleFontSize(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              內文字體大小：{bodyFontSize.toFixed(2)}rem
            </label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={bodyFontSize}
              onChange={(e) => setBodyFontSize(parseFloat(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>
  
          <div className="mt-6 text-center">
            <button
              onClick={handleCopyPrompt}
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
              複製 GPT 指令
            </button>
          </div>
        </div>
  
        {/* 右側卡片預覽區 */}
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center">命理卡預覽</h2>
          <div
            ref={previewRef}
            className="rounded-2xl shadow-lg border border-gray-300 overflow-hidden"
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
              paddingTop: "30px",
              paddingLeft: "40px",
              paddingRight: "40px",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                fontSize: `${titleFontSize.toFixed(2)}rem`,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "24px",
                color: textColor,
                textShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              {name} 的流年運勢報告書
            </div>
  
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
  
          <button
            onClick={handleDownload}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            下載命理卡
          </button>
        </div>
      </div>
    </div>
  );
}
