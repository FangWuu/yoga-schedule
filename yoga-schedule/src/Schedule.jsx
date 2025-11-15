"use client";
import React, { useRef, useEffect, useState } from "react";
import headerBg from "./background3.jpg";
import bodyBg from "./background3.jpg";
import footerBg from "./background3.jpg";
import logoImg from "./logo.jpg";

/** @typedef {{ time:string, name:string, instructor:string, isAdvanced?:boolean }} YogaClass */
/** @typedef {{ day:string, date:string, classes: Array<YogaClass | 'OFF'> }} DaySchedule */

/** @type {DaySchedule[]} */
const initialSchedule = [
  { day: "MON", date: "17 NOV", classes: [
      { time: "07:15 - 08:15", name: "WHEEL YOGA", instructor: "RANA" },
      "OFF",
      { time: "18:00 - 19:00", name: "HATHA YOGA", instructor: "RANA" },
    ]},
  { day: "TUE", date: "18 NOV", classes: [
      { time: "07:15 - 08:15", name: "BACK BENDING", instructor: "SINGH" },
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 300K)", instructor: "ADITYA" },
      { time: "18:00 - 19:00", name: "SHOULDER & BACK BENDING", instructor: "SINGH" },
    ]},
  { day: "WED", date: "19 NOV", classes: [
      { time: "07:15 - 08:15", name: "SHOULDER TWISTING", instructor: "RANA" },
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 300K)", instructor: "ADITYA" },
      { time: "18:00 - 19:00", name: "HIP OPENING", instructor: "ZULKA" },
    ]},
  { day: "THU", date: "20 NOV", classes: [
      { time: "07:15 - 08:15", name: "HIP OPENING", instructor: "SINGH" },
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 300K)", instructor: "ADITYA" },
      { time: "18:00 - 19:00", name: "BALANCE YOGA", instructor: "RANA" },
    ]},
  { day: "FRI", date: "21 NOV", classes: [
      { time: "07:15 - 08:15", name: "BLOCK YOGA", instructor: "RANA" },
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 300K)", instructor: "ADITYA" },
      { time: "18:00 - 19:00", name: "BACK BENDING", instructor: "SINGH" },
    ]},
  { day: "SAT", date: "22 NOV", classes: [
      { time: "07:15 - 08:15", name: "BACK & TWIST", instructor: "SINGH" },
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 500K)", instructor: "ADITYA", isAdvanced: true },
      { time: "18:00 - 19:00", name: "HIP OPENING", instructor: "SINGH" },
    ]},
  { day: "SUN", date: "23 NOV", classes: [
      "OFF",
      { time: "09:00 - 11:00", name: "MYSORE ASHTANGA (150 min) (DROP IN 500K)", instructor: "ADITYA", isAdvanced: true },
      "OFF",
    ]},
];

// 🔹 Helper: tách tên lớp và phần trong ngoặc, cho size nhỏ hơn
function renderClassName(name, goldTextStyle) {
  const match = name.match(/^(.*?)(\s*\(.*\))/); // bắt phần đầu + phần trong ngoặc
  if (!match) {
    return (
      <span
        className="text-[13.5px] font-extrabold leading-snug tracking-wide break-words"
        style={goldTextStyle}
      >
        {name}
      </span>
    );
  }

  return (
    <>
      <span
        className="block text-[13.5px] font-extrabold leading-snug tracking-wide break-words"
        style={goldTextStyle}
      >
        {match[1]}
      </span>
      <span
        className="block text-[10px] font-semibold leading-snug tracking-wide mt-0.5"
        style={goldTextStyle}
      >
        {match[2]}
      </span>
    </>
  );
}

export default function App() {
  const [data, setData] = useState(initialSchedule);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Montserrat:wght@600;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const contentRef = useRef(null);

  const goldTextStyle = {
    backgroundImage: "linear-gradient(180deg,#fdf3c4,#f5d76e,#d4a017)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const offGoldStyle = {
    color: "#f6d26b",
    textShadow: "0 0 1px rgba(0,0,0,0.6), 0 0 3px rgba(255,215,0,0.55)",
  };

  const handleClassChange = (dayIndex, classIndex, field, value) => {
    setData(prev => {
      const copy = prev.map(day => ({
        ...day,
        classes: [...day.classes],
      }));

      const item = copy[dayIndex].classes[classIndex];
      if (item === "OFF") return prev;

      copy[dayIndex].classes[classIndex] = {
        ...item,
        [field]: value,
      };

      return copy;
    });
  };

  const handleDayFieldChange = (dayIndex, field, value) => {
    setData(prev => {
      const copy = prev.map(day => ({
        ...day,
        classes: [...day.classes],
      }));

      copy[dayIndex] = {
        ...copy[dayIndex],
        [field]: value,
      };

      return copy;
    });
  };

  const handleDownload = async () => {
    const node = contentRef.current;
    if (!node) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement("a");
    link.download = "yoga_schedule_905x1280.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      {/* nút ngoài vùng chụp */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setIsEditing(e => !e)}
          className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-900 shadow ring-1 ring-amber-300 hover:bg-amber-200"
        >
          {isEditing ? "✅ Done Editing" : "✏️ Edit Schedule"}
        </button>
        <button
          onClick={handleDownload}
          className="rounded-full px-3 py-1 text-xs font-semibold bg-white shadow ring-1 ring-black/10 hover:bg-gray-50"
        >
          Download PNG
        </button>
      </div>

      {/* Poster 905×1280 */}
      <div
        ref={contentRef}
        className="w-[905px] h-[1280px] bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-rows-[auto,1fr,auto]"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}
      >
        {/* Header */}
        <div className="relative h-[260px] overflow-hidden rounded-t-2xl">
          <img
            src={headerBg}
            alt="Yoga header background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-white/0" />
          <div className="relative z-10 px-12 py-8 flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-white/40 rounded-full grid place-items-center backdrop-blur-sm mb-3">
                <div className="text-black text-2xl">🧘</div>
              </div>
              <h1 className="text-black text-[56px] leading-tight font-light tracking-tight">
                YOGA CLASS
              </h1>
              <h2 className="text-black text-[56px] leading-tight font-light tracking-tight">
                SCHEDULE
              </h2>
              <div className="h-1 w-28 bg-black/60 mt-4 rounded-full" />
            </div>

            <img
              src={logoImg}
              alt="Yoga Center Logo"
              className="h-12 w-auto mt-1 drop-shadow-md rounded-sm select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Body */}
        <div
          className="px-6 py-8"
          style={{
            backgroundImage: `url(${bodyBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-7 gap-2 h-full">
            {data.map((day, idx) => (
              <div key={idx} className="grid grid-rows-[auto,1fr] min-w-0">
                {/* Day Header */}
                <div
                  className="bg-gradient-to-br from-gray-400 to-gray-300 rounded-t-xl px-2 py-2 text-center"
                  style={{ fontFamily: "'Montserrat','Inter',ui-sans-serif" }}
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-1">
                      <input
                        className="w-full text-[11px] font-extrabold uppercase tracking-[0.12em] text-center rounded bg-white/60 text-gray-800 px-1 py-0.5"
                        value={day.day}
                        onChange={(e) =>
                          handleDayFieldChange(idx, "day", e.target.value)
                        }
                      />
                      <input
                        className="w-full text-[10px] tracking-wide text-center rounded bg-white/60 text-gray-700 px-1 py-0.5"
                        value={day.date}
                        onChange={(e) =>
                          handleDayFieldChange(idx, "date", e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-700 text-sm font-extrabold tracking-[0.08em]">
                        {day.day}
                      </div>
                      <div className="text-gray-600 text-[11px] tracking-wide">
                        {day.date}
                      </div>
                    </>
                  )}
                </div>

                {/* Classes */}
                <div className="bg-[#D3B683] rounded-b-xl p-2 border border-[#c9a463] border-t-0 h-full box-border overflow-hidden min-w-0">
                  <ul className="flex flex-col h-full gap-2 list-none m-0 p-0">
                    {day.classes.map((classItem, classIdx) => (
                      <li key={classIdx} className="flex-1 flex items-stretch">
                        {classItem === "OFF" ? (
                          <div
                            className="flex-1 flex items-center justify-center rounded-lg bg-[#3b2b1e] text-[15px] font-extrabold tracking-widest"
                            style={{
                              ...offGoldStyle,
                              fontFamily: "'Montserrat','Inter',ui-sans-serif",
                            }}
                          >
                            OFF
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center bg-[#3b2b1e] rounded-lg p-2 shadow-md border border-[#f5d76e]/70 text-center overflow-hidden">
                            {isEditing ? (
                              <>
                                <input
                                  className="w-full mb-1 text-[11px] px-1 py-0.5 rounded bg-black/20 text-amber-100 text-center"
                                  value={classItem.time}
                                  onChange={(e) =>
                                    handleClassChange(idx, classIdx, "time", e.target.value)
                                  }
                                />
                                <input
                                  className="w-full mb-1 text-[12px] px-1 py-0.5 rounded bg-black/20 text-amber-100 text-center"
                                  value={classItem.name}
                                  onChange={(e) =>
                                    handleClassChange(idx, classIdx, "name", e.target.value)
                                  }
                                />
                                <input
                                  className="w-full text-[11px] px-1 py-0.5 rounded bg-black/20 text-amber-100 text-center"
                                  value={classItem.instructor}
                                  onChange={(e) =>
                                    handleClassChange(idx, classIdx, "instructor", e.target.value)
                                  }
                                />
                              </>
                            ) : (
                              <>
                                {/* Giờ */}
                                <div
                                  className="text-[12px] font-semibold mb-1 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis leading-none"
                                  style={{
                                    ...goldTextStyle,
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {classItem.time}
                                </div>
                                {/* Tên lớp + phần ngoặc nhỏ hơn */}
                                <div
                                  className="leading-snug tracking-wide text-center"
                                  style={{
                                    fontFamily: "'Montserrat','Inter',ui-sans-serif",
                                  }}
                                >
                                  {renderClassName(classItem.name, goldTextStyle)}
                                </div>
                                {/* Giáo viên */}
                                <div
                                  className="text-[11.5px] font-semibold tracking-widest mt-1"
                                  style={{
                                    ...goldTextStyle,
                                    fontFamily: "'Montserrat','Inter',ui-sans-serif",
                                  }}
                                >
                                  {classItem.instructor}
                                </div>
                                {classItem.isAdvanced && (
                                  <div className="text-[11px] mt-1" style={goldTextStyle}>
                                    (ADV CLASS)
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative border-t border-gray-200"
          style={{
            backgroundImage: `url(${footerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-white/80" />
          <div className="relative px-12 py-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3
                  className="text-gray-800 tracking-wider mb-3 flex items-center gap-2 text-base font-semibold"
                  style={{ fontFamily: "'Montserrat','Inter',ui-sans-serif" }}
                >
                  <span>📋</span> CLASS RULES
                </h3>
                <ul className="space-y-2 text-[13px] text-gray-700 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-gray-400">1.</span>
                    <span>Please maintain silence – no chit-chat during class.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400">2.</span>
                    <span>Mobile phone use is not allowed during class.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400">3.</span>
                    <span>Let's keep the space peaceful and focused.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3
                  className="text-gray-800 tracking-wider mb-3 flex items-center gap-2 text-base font-semibold"
                  style={{ fontFamily: "'Montserrat','Inter',ui-sans-serif" }}
                >
                  <span>📍</span> CONTACT INFO
                </h3>
                <div className="space-y-2 text-[13px] text-gray-700 leading-relaxed">
                  <p>111 Dao Duy Tu, Dien Hong Ward</p>
                  <p>District 10, HCMC</p>
                  <p>0334644696 (Thuy)</p>
                  <p className="pt-2 text-gray-900 font-semibold">www.yogagoals.vn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END poster */}
    </div>
  );
}
