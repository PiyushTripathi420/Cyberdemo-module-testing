/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { void: "#0b0c10", panel: "#10161d", cyan: "#45a29e", mint: "#66fcf1", line: "#17343a" },
    fontFamily: { mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] },
    boxShadow: { glow: "0 0 24px rgba(102,252,241,.12)" }
  }},
  plugins: []
};
