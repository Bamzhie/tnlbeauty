import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_COLORS } from "../utils";
import * as d3 from "d3";

interface ExpenseBreakdownChartProps {
  data: Array<{ name: string; value: number }>;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
  data,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<{ name: string; value: number }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Draw slices
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => EXPENSE_COLORS[d.data.name] || "#a1a1aa")
      .attr("stroke", "none"); // No stroke at all

    // Add percentage labels
    arcs.append("text")
      .attr("transform", d => {
        const pos = arc.centroid(d);
        return `translate(${pos[0]}, ${pos[1]})`;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => {
        const total = d3.sum(data, item => item.value);
        const percent = ((d.data.value / total) * 100).toFixed(1);
        return `${percent}%`;
      });

  }, [data]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-blue-900 text-sm sm:text-base">
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* D3 Pie Chart */}
          <div className="w-full h-64">
            <svg 
              ref={svgRef} 
              className="w-full h-full"
              style={{ background: 'transparent' }}
            />
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: EXPENSE_COLORS[entry.name] || "#a1a1aa" }}
                ></span>
                <span className="text-xs text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};