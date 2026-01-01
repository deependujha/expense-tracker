"use client";

import { useEffect, useState } from "react";
import { getAllExpenses } from "@/db/index_db_helper";
import {
    CategoryMap,
    Expense,
} from "@/constants/types";
import {
    ChartPieDonutText,
    PieDatum,
} from "@/components/charts/pie-chart";
import { MonthKey, formatMonth, getRecentMonths } from "./month-utils";
import { MonthScroller } from "./month-scroller";


/* ---------- Helpers ---------- */

const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date( now.getFullYear(), now.getMonth(), 1 ).getTime();
    const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    ).getTime();
    return { start, end };
};

const groupByCategory = ( expenses: Expense[] ) => {
    return expenses.reduce<Record<string, number>>( ( acc, e ) => {
        acc[ e.categoryId ] = ( acc[ e.categoryId ] || 0 ) + e.amount;
        return acc;
    }, {} );
};

/* ---------- Component ---------- */

const now = new Date();

export const StatsTab = () => {

    const [ selectedMonth, setSelectedMonth ] = useState( {
        year: now.getFullYear(),
        month: now.getMonth(),
    } );
    const [ loading, setLoading ] = useState( true );
    const [ monthlyExpenses, setMonthlyExpenses ] = useState<Expense[]>( [] );

    const getMonthRange = ( { year, month }: MonthKey ) => {
        const start = new Date( year, month, 1 ).getTime();
        const end = new Date( year, month + 1, 0, 23, 59, 59, 999 ).getTime();
        return { start, end };
    };
    const months = getRecentMonths( 6 );


    useEffect( () => {
        const { start, end } = getMonthRange( selectedMonth );

        getAllExpenses()
            .then( ( expenses ) => {
                setMonthlyExpenses(
                    expenses.filter(
                        ( e ) => e.createdAt >= start && e.createdAt <= end
                    )
                );
            } )
            .finally( () => setLoading( false ) );
    }, [ selectedMonth ] );

    if ( loading ) {
        return (
            <div className="flex h-full items-center justify-center text-neutral-400">
                Loading stats…
            </div>
        );
    }

    if ( monthlyExpenses.length === 0 ) {
        return (
            <div className="p-4 space-y-6">
                <MonthScroller
                    months={ months }
                    selected={ selectedMonth }
                    onSelect={ setSelectedMonth }
                />
                <div className="text-center text-neutral-400 flex flex-col h-[85vh] items-center justify-center">
                    No expenses this month.
                </div>
            </div>
        );
    }

    const total = monthlyExpenses.reduce(
        ( sum, e ) => sum + e.amount,
        0
    );

    const daysSoFar = new Date().getDate();
    const avgPerDay = Math.round( total / daysSoFar );

    const groupedTotals = groupByCategory( monthlyExpenses );

    const pieData: PieDatum[] = Object.entries( groupedTotals ).map(
        ( [ categoryId, value ] ) => {
            const category = CategoryMap[ categoryId ];
            return {
                name: category?.name ?? "Unknown",
                value,
                fill: category?.color ?? "#e5e7eb",
            };
        }
    );

    return (
        <div className="p-4 space-y-6">
            {/* Pie Chart */ }
            <MonthScroller
                months={ months }
                selected={ selectedMonth }
                onSelect={ setSelectedMonth }
            />
            <ChartPieDonutText data={ pieData } />

            {/* Summary */ }
            <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2">
                <div className="text-sm text-neutral-500">
                    Total this month
                </div>
                <div className="text-2xl font-semibold">
                    ₹{ total }
                </div>
                <div className="text-sm text-neutral-500">
                    Avg per day: ₹{ avgPerDay }
                </div>
            </div>

            {/* Category Breakdown */ }
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="text-sm font-medium text-neutral-600 mb-3">
                    By category
                </div>

                <ul className="space-y-2">
                    { pieData.map( ( item ) => (
                        <li
                            key={ item.name }
                            className="flex justify-between text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={ { backgroundColor: item.fill } }
                                />
                                <span className="text-neutral-600">
                                    { item.name }
                                </span>
                            </div>
                            <span className="font-medium">
                                ₹{ item.value }
                            </span>
                        </li>
                    ) ) }
                </ul>
            </div>
        </div>
    );
};
