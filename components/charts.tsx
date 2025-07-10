"use client"

// This file acts as a wrapper to insulate Next.js's dynamic import
// from the complex type definitions of the recharts library.

import {
  Bar as RechartsBar,
  Line as RechartsLine,
  Pie as RechartsPie,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Legend as RechartsLegend,
  Tooltip as RechartsTooltip,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  CartesianGrid as RechartsCartesianGrid,
  ResponsiveContainer as RechartsResponsiveContainer,
  Cell as RechartsCell,
  ComposedChart as RechartsComposedChart,
} from "recharts"

// FINAL SOLUTION: Use 'props: any' to bypass the deep type-checking
// issues with 'ref' and other intrinsic attributes.

export const Bar = (props: any) => <RechartsBar {...props} />
export const Line = (props: any) => <RechartsLine {...props} />
export const Pie = (props: any) => <RechartsPie {...props} />
export const XAxis = (props: any) => <RechartsXAxis {...props} />
export const YAxis = (props: any) => <RechartsYAxis {...props} />
export const Legend = (props: any) => <RechartsLegend {...props} />
export const Tooltip = (props: any) => <RechartsTooltip {...props} />
export const BarChart = (props: any) => <RechartsBarChart {...props} />
export const LineChart = (props: any) => <RechartsLineChart {...props} />
export const PieChartRecharts = (props: any) => <RechartsPieChart {...props} />
export const CartesianGrid = (props: any) => <RechartsCartesianGrid {...props} />
export const ResponsiveContainer = (props: any) => <RechartsResponsiveContainer {...props} />
export const Cell = (props: any) => <RechartsCell {...props} />
export const ComposedChart = (props: any) => <RechartsComposedChart {...props} />