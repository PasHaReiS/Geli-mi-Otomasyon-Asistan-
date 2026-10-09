import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrendingUp, Wheat, Swords, Zap, Activity } from 'lucide-react';

export interface ChartDataPoint {
  time: string;
  timestamp: number;
  resourcesK: number; // in thousands (k)
  monsters: number;
  stamina: number;
}

interface RealtimeMetricsChartProps {
  lang: 'tr' | 'en';
  currentResources: number;
  currentMonsters: number;
  currentStamina: number;
  isRunning: boolean;
}

export const RealtimeMetricsChart: React.FC<RealtimeMetricsChartProps> = ({
  lang,
  currentResources,
  currentMonsters,
  currentStamina,
  isRunning
}) => {
  const [dataPoints, setDataPoints] = useState<ChartDataPoint[]>(() => {
    // Seed initial 6-8 historical points leading up to current values
    const now = Date.now();
    const initial: ChartDataPoint[] = [];
    const baseResK = Math.max(0, Math.round(currentResources / 1000) - 45);
    const baseMonsters = Math.max(0, currentMonsters - 4);

    for (let i = 7; i >= 0; i--) {
      const pointTime = new Date(now - i * 15000);
      const timeStr = pointTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const stepFactor = (7 - i) / 7;
      initial.push({
        time: timeStr,
        timestamp: pointTime.getTime(),
        resourcesK: Math.round(baseResK + stepFactor * 45),
        monsters: Math.round(baseMonsters + stepFactor * 4),
        stamina: Math.max(20, Math.min(100, Math.round(currentStamina + (i % 2 === 0 ? 5 : -5))))
      });
    }
    return initial;
  });

  const [activeSeries, setActiveSeries] = useState<'all' | 'resources' | 'monsters'>('all');

  // Push new data point whenever resources or monsters change or periodically while running
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const resK = Math.round(currentResources / 1000);

    setDataPoints((prev) => {
      const lastPoint = prev[prev.length - 1];
      // Avoid duplicate consecutive timestamps
      if (lastPoint && lastPoint.time === timeStr) {
        return prev.map((p, idx) =>
          idx === prev.length - 1
            ? { ...p, resourcesK: resK, monsters: currentMonsters, stamina: currentStamina }
            : p
        );
      }

      const newPoint: ChartDataPoint = {
        time: timeStr,
        timestamp: Date.now(),
        resourcesK: resK,
        monsters: currentMonsters,
        stamina: currentStamina
      };

      // Keep last 15 points for clean readable chart
      return [...prev.slice(-14), newPoint];
    });
  }, [currentResources, currentMonsters, currentStamina]);

  // Periodic ticker every 6 seconds if bot is running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;

        const newPoint: ChartDataPoint = {
          time: timeStr,
          timestamp: Date.now(),
          resourcesK: Math.round(currentResources / 1000),
          monsters: currentMonsters,
          stamina: currentStamina
        };
        return [...prev.slice(-14), newPoint];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isRunning, currentResources, currentMonsters, currentStamina]);

  // Calculate rate per hour estimate
  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];
  const diffSec = firstPoint && lastPoint ? Math.max(1, (lastPoint.timestamp - firstPoint.timestamp) / 1000) : 60;
  const resGain = firstPoint && lastPoint ? Math.max(0, lastPoint.resourcesK - firstPoint.resourcesK) : 0;
  const hourlyResRateK = Math.round((resGain / diffSec) * 3600);

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800 mb-1.5 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>{label}</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-semibold text-slate-200">
                {entry.dataKey === 'resourcesK' ? `${entry.value.toLocaleString()}k` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header Bar */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">
              {lang === 'tr' ? 'Gerçek Zamanlı Veri Grafiği' : 'Real-Time Metrics'}
            </span>
            <span className="text-slate-500 text-[11px] font-mono ml-2 hidden sm:inline">
              (Recharts Live Feed)
            </span>
          </div>
        </div>

        {/* Series Filter Selector */}
        <div className="flex items-center bg-black/60 border border-slate-800 rounded-md p-0.5 text-[11px]">
          <button
            onClick={() => setActiveSeries('all')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeSeries === 'all'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'tr' ? 'Tümü' : 'All'}
          </button>
          <button
            onClick={() => setActiveSeries('resources')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeSeries === 'resources'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'tr' ? 'Kaynak' : 'Resources'}
          </button>
          <button
            onClick={() => setActiveSeries('monsters')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeSeries === 'monsters'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'tr' ? 'Canavar' : 'Monsters'}
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wheat className="w-3 h-3" />
            <span>Kaynak:</span>
            <strong className="text-slate-200">{Math.round(currentResources / 1000)}k</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-rose-400">
            <Swords className="w-3 h-3" />
            <span>Canavar:</span>
            <strong className="text-slate-200">{currentMonsters}</strong>
          </div>
        </div>

        <div className="text-slate-400 text-[10px] hidden sm:block">
          {lang === 'tr' ? 'Hız:' : 'Yield:'} <span className="text-emerald-400 font-semibold">+{hourlyResRateK > 0 ? hourlyResRateK : 65}k/saat</span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-2.5 flex-1 min-h-[220px] w-full bg-slate-950/80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataPoints} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            {/* Left Y Axis for Resources (k) */}
            <YAxis
              yAxisId="left"
              stroke="#10b981"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${val}k`}
              domain={['auto', 'auto']}
            />
            {/* Right Y Axis for Monster count */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f43f5e"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              domain={[0, 'auto']}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
              formatter={(value) => (
                <span className="text-slate-300 text-[11px] font-sans">
                  {value === 'resourcesK'
                    ? (lang === 'tr' ? 'Toplanan Kaynak (k)' : 'Resources Gathered (k)')
                    : (lang === 'tr' ? 'Yok Edilen Canavar (Adet)' : 'Monsters Defeated')}
                </span>
              )}
            />

            {(activeSeries === 'all' || activeSeries === 'resources') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="resourcesK"
                name={lang === 'tr' ? 'Kaynak' : 'Resources'}
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#34d399' }}
                isAnimationActive={false}
              />
            )}

            {(activeSeries === 'all' || activeSeries === 'monsters') && (
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="monsters"
                name={lang === 'tr' ? 'Canavar' : 'Monsters'}
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f43f5e', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#fb7185' }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
