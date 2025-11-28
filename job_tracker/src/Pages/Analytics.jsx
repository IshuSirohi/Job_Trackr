import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function Analytics() {
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [stats, setStats] = useState({});
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    // STATUS COUNTS
    const statusCounts = { Applied: 0, Interview: 0, Rejected: 0, Accepted: 0 };
    jobs.forEach((job) => {
      if (statusCounts[job.status] !== undefined) statusCounts[job.status]++;
    });
    setStats(statusCounts);
    setStatusData([
      { name: "Applied", value: statusCounts.Applied },
      { name: "Interview", value: statusCounts.Interview },
      { name: "Rejected", value: statusCounts.Rejected },
      { name: "Accepted", value: statusCounts.Accepted },
    ]);

    // MONTHLY
    const months = Array(12).fill(0);
    jobs.forEach((job) => {
      if (!job.date) return;
      const m = new Date(job.date).getMonth();
      months[m]++;
    });
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedMonthly = monthNames.map((m, i) => ({
      month: m,
      count: months[i],
    }));
    setMonthlyData(formattedMonthly);

    // TREND (cumulative)
    let cumulative = 0;
    const trend = formattedMonthly.map((m) => {
      cumulative += m.count;
      return { month: m.month, total: cumulative };
    });
    setTrendData(trend);
  }, []);

  const COLORS = ["#06B6D4", "#F59E0B", "#EF4444", "#10B981"]; // cyan, amber, red, green

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <h2 className="text-3xl font-bold text-white mb-8">📊 Job Analytics</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl mb-8">
        {Object.entries(stats).map(([key, val]) => (
          <div
            key={key}
            className="bg-white/12 text-white p-4 rounded-xl text-center"
          >
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-sm opacity-80">{key}</p>
          </div>
        ))}
      </div>

      {/* MAIN ROW: LEFT = PIE, RIGHT = STACKED (LINE TOP + BAR BOTTOM) */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Pie card */}
        <div
          className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 
  h-auto md:h-[600px] flex flex-col"
        >
          <h3 className="text-xl font-bold text-white text-center mb-4">
            Application Status Breakdown
          </h3>

          <div className="flex-1 min-h-[300px]">
            {statusData.every((s) => s.value === 0) ? (
              <p className="text-center text-gray-300 mt-20">
                No job data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 90 : 140}
// ⭐ AUTO-SCALES ON PHONE
                    label={
                      isMobile
                        ? ({ percent }) => `${(percent * 100).toFixed(0)}%` // only % inside slices
                        : ({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={!isMobile}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RIGHT: stacked top & bottom — total height equals left */}
        <div className="flex flex-col gap-6 h-[600px]">
          {/* top: Trend line (takes half height) */}
          <div className="p-4 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 h-1/2 flex flex-col">
            <h3 className="text-lg font-bold text-white text-center mb-2">
              Application Trend (Cumulative)
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid opacity={0.15} />
                  <XAxis dataKey="month" stroke="#D1D5DB" />
                  <YAxis stroke="#D1D5DB" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* bottom: Monthly bar (takes half height) */}
          <div className="p-4 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 h-1/2 flex flex-col">
            <h3 className="text-lg font-bold text-white text-center mb-2">
              Monthly Applications
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid opacity={0.15} />
                  <XAxis dataKey="month" stroke="#D1D5DB" />
                  <YAxis stroke="#D1D5DB" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#60A5FA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
