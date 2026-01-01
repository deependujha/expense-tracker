"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

/* ---------- Types ---------- */

export type PieDatum = {
    name: string;
    value: number;
    fill: string;
};

/* ---------- Helpers ---------- */

const getCurrentMonthAndYear = () => {
    const now = new Date();
    const month = now.toLocaleString( "default", { month: "long" } );
    const year = now.getFullYear();
    return `${month} ${year}`;
};

/* ---------- Component ---------- */

export function ChartPieDonutText( {
    data,
    selectedMonth,
}: {
    data: PieDatum[];
    selectedMonth: string;
} ) {
    const chartConfig = React.useMemo( () =>
        data.reduce( ( acc, curr ) => {
            acc[ curr.name ] = {
                label: curr.name,
                color: curr.fill,
            };
            return acc;
        }, {} as Record<string, { label: string; color: string }> ),
        [ data ]
    );

    const total = React.useMemo(
        () => data.reduce( ( acc, curr ) => acc + curr.value, 0 ),
        [ data ]
    );

    const enriched = React.useMemo(
        () => data.map( ( d ) => ( {
            ...d,
            percent: total > 0 ? Math.round( ( d.value / total ) * 100 ) : 0,
        } ) ),
        [ data, total ]
    );

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>{ selectedMonth }</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col justify-center pb-0">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                    { enriched.map( ( item ) => (
                        <div
                            key={ item.name }
                            className="flex items-center gap-2 rounded-full border px-3 py-1"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={ { backgroundColor: item.fill } }
                            />
                            <span className="font-medium">{ item.name }</span>
                            <span className="text-muted-foreground">{ item.percent }%</span>
                        </div>
                    ) ) }
                </div>

                <ChartContainer config={ chartConfig } className="aspect-square max-h-65 w-full">
                    <PieChart>
                        <ChartTooltip
                            cursor={ false }
                            content={ <ChartTooltipContent hideLabel /> }
                        />
                        <Pie
                            data={ enriched }
                            dataKey="value"
                            nameKey="name"
                            innerRadius={ 70 }
                            outerRadius={ 100 }
                            strokeWidth={ 4 }
                            label={ false }
                            labelLine={ false }
                        >

                            <Label
                                content={ ( { viewBox } ) => {
                                    if ( !viewBox || !( "cx" in viewBox ) ) return null;

                                    return (
                                        <text
                                            x={ viewBox.cx }
                                            y={ viewBox.cy }
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={ viewBox.cx }
                                                y={ viewBox.cy }
                                                className="fill-foreground text-2xl font-bold"
                                            >
                                                ₹{ total.toLocaleString() }
                                            </tspan>
                                            <tspan
                                                x={ viewBox.cx }
                                                y={ ( viewBox.cy || 0 ) + 22 }
                                                className="fill-muted-foreground text-sm"
                                            >
                                                {selectedMonth}
                                            </tspan>
                                        </text>
                                    );
                                } }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground justify-center">
                Showing category-wise monthly expenses
            </CardFooter>
        </Card>
    );
}
