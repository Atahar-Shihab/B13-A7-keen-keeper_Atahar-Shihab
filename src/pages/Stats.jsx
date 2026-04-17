import { useContext } from "react";
import { TimelineContext } from "../context/TimelineContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = {
  Text: "#9b59b6",
  Call: "#2d6a4f",
  Video: "#52b788",
};

const CustomLegend = () => (
  <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "12px" }}>
    {[
      { name: "Text", color: COLORS.Text },
      { name: "Call", color: COLORS.Call },
      { name: "Video", color: COLORS.Video },
    ].map(({ name, color }) => (
      <div key={name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          backgroundColor: color,
        }} />
        <span style={{ fontSize: "0.7rem", color: "#6c757d" }}>{name}</span>
      </div>
    ))}
  </div>
);

const Stats = () => {
  const { timeline } = useContext(TimelineContext);

  const callCount = timeline.filter((t) => t.type === "Call").length;
  const textCount = timeline.filter((t) => t.type === "Text").length;
  const videoCount = timeline.filter((t) => t.type === "Video").length;

  const data = [
    { name: "Text", value: textCount },
    { name: "Call", value: callCount },
    { name: "Video", value: videoCount },
  ].filter((item) => item.value > 0);

  return (
    <div style={{ padding: "2rem", maxWidth: "760px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#212529", marginBottom: "1.5rem" }}>
        Friendship Analytics
      </h1>

      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e9ecef",
        borderRadius: "10px",
        padding: "1.5rem",
      }}>
        <p style={{ fontSize: "0.8rem", color: "#6c757d", marginBottom: "1rem" }}>
          By Interaction Type
        </p>

        {timeline.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem",
            color: "#6c757d", fontSize: "0.875rem",
          }}>
            Log some interactions to see your chart!
          </div>
        ) : (
          <>
            <div style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[entry.name] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "6px", border: "1px solid #e9ecef",
                      fontSize: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <CustomLegend />
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;