// src/components/AnalyticsSection.js
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import './AnalyticsSection.css';

const GOAL_COLORS = ['#10B981', '#6366F1']; // Completed (green), Pending (purple)

const AnalyticsSection = ({ analyticsData, loading }) => {
    if (loading) {
        return (
            <div className="analytics-section">
                <div className="analytics-loading">Loading analytics...</div>
            </div>
        );
    }

    if (!analyticsData) {
        return null;
    }

    const { goalsStats, subjectDistribution } = analyticsData;

    // Prepare goal completion data for PieChart
    const goalCompletionData = [
        { name: 'Completed', value: goalsStats?.completed || 0 },
        { name: 'Pending', value: goalsStats?.pending || 0 }
    ];

    const hasGoals = goalsStats?.total > 0;
    const hasSubjects = subjectDistribution?.length > 0;

    // Custom tooltip for better interactivity
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].name}</p>
                    <p className="tooltip-value">{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-section">
            <h2 className="analytics-title">📊 Analytics Overview</h2>

            <div className="charts-container">
                {/* Goal Completion PieChart */}
                <div className="chart-card">
                    <h3 className="chart-title">Goal Completion</h3>
                    {hasGoals ? (
                        <>
                            <div className="completion-percentage">
                                <span className="percentage-value">{goalsStats.completionPercentage}%</span>
                                <span className="percentage-label">Complete</span>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={goalCompletionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {goalCompletionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={GOAL_COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span className="legend-text">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="chart-stats">
                                <div className="stat-item">
                                    <span className="stat-dot completed"></span>
                                    <span>{goalsStats.completed} Completed</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-dot pending"></span>
                                    <span>{goalsStats.pending} Pending</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-data">
                            <span className="no-data-icon">🎯</span>
                            <p>No goals yet. Create your first goal to see analytics!</p>
                        </div>
                    )}
                </div>

                {/* Subject Distribution BarChart */}
                <div className="chart-card">
                    <h3 className="chart-title">Subject Topics</h3>
                    {hasSubjects ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={subjectDistribution}
                                layout="vertical"
                                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis type="number" stroke="var(--text-secondary)" />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={100}
                                    stroke="var(--text-secondary)"
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar
                                    dataKey="topicCount"
                                    name="Topics"
                                    radius={[0, 4, 4, 0]}
                                >
                                    {subjectDistribution.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={entry.color || '#667eea'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data">
                            <span className="no-data-icon">📚</span>
                            <p>No subjects yet. Add subjects with topics to see distribution!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
