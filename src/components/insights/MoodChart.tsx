import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MoodType } from '../../types'

interface DistributionPoint {
  mood: MoodType
  label: string
  count: number
  color: string
}

interface TrendPoint {
  day: string
  score: number
  mood: string
}

export function MoodDistributionChart({ data }: { data: DistributionPoint[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Mood distribution chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,54,43,0.08)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4a5d52' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#4a5d52' }} />
          <Tooltip
            cursor={{ fill: 'rgba(143,173,134,0.12)' }}
            contentStyle={{
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(36,54,43,0.1)',
            }}
          />
          <Bar dataKey="count" radius={[10, 10, 4, 4]}>
            {data.map((entry) => (
              <Cell key={entry.mood} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MoodTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Weekly mood trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,54,43,0.08)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4a5d52' }} />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#4a5d52' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(36,54,43,0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#5F7D58"
            strokeWidth={3}
            dot={{ r: 4, fill: '#F0C9A8', stroke: '#5F7D58', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
