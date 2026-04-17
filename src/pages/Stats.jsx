import { useContext } from "react";
import { TimelineContext } from "../context/TimelineContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Stats = () => {
  const { timeline } = useContext(TimelineContext);

  // Calculate the counts for the pie chart dynamically
  const callCount = timeline.filter(t => t.type === 'Call').length;
  const textCount = timeline.filter(t => t.type === 'Text').length;
  const videoCount = timeline.filter(t => t.type === 'Video').length;

  const data = [
    { name: 'Calls', value: callCount },
    { name: 'Texts', value: textCount },
    { name: 'Video', value: videoCount },
  ];

  // DaisyUI colors to match our buttons
  const COLORS = ['#570df8', '#f000b8', '#37cdbe'];

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Friendship Analytics</h1>
      
      {timeline.length === 0 ? (
        <div className="alert bg-base-200">Log some interactions to see your analytics!</div>
      ) : (
        <div className="card bg-base-100 shadow-xl border border-base-200 p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Stats;