import { useContext } from "react";
import { TimelineContext } from "../context/TimelineContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Stats = () => {
  const { timeline } = useContext(TimelineContext);

  const callCount = timeline.filter(t => t.type === 'Call').length;
  const textCount = timeline.filter(t => t.type === 'Text').length;
  const videoCount = timeline.filter(t => t.type === 'Video').length;

  const data = [
    { name: 'Calls', value: callCount },
    { name: 'Texts', value: textCount },
    { name: 'Video', value: videoCount },
  ].filter(item => item.value > 0);

  // Exact matching pastel brand colors for the Pie chart
  const COLORS = ['#22c55e', '#3b82f6', '#a855f7'];

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Friendship Analytics</h1>
      
      {timeline.length === 0 ? (
        <div className="bg-white text-gray-500 p-10 rounded-3xl text-center border border-gray-100 shadow-sm font-medium">Log some interactions to see your chart!</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Interaction Breakdown</h2>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={150}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;