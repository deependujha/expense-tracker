"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

/* ---------- Types ---------- */

type Category = {
    id: string;
    name: string;
    emoji: string;
};

type Expense = {
    id: string;
    category: Category;
    title: string;
    description?: string;
    amount: number;
    createdAt: number;
};

/* ---------- Static Data ---------- */

const categories: Category[] = [
    { id: "food", name: "Food", emoji: "🍔" },
    { id: "coffee", name: "Coffee", emoji: "☕" },
    { id: "travel", name: "Travel", emoji: "🚕" },
    { id: "shopping", name: "Shopping", emoji: "🛍️" },
];

/* ---------- Component ---------- */

export const TodayTab = () => {
    const [ expenses, setExpenses ] = useState<Expense[]>( [] );
    const [ showForm, setShowForm ] = useState( false );

    const [ categoryId, setCategoryId ] = useState( categories[ 0 ].id );
    const [ title, setTitle ] = useState( "" );
    const [ description, setDescription ] = useState( "" );
    const [ amount, setAmount ] = useState( "" );

    const addExpense = () => {
        if ( !title || !amount ) return;

        const category = categories.find( ( c ) => c.id === categoryId )!;

        setExpenses( ( prev ) => [
            {
                id: crypto.randomUUID(),
                category,
                title,
                description: description || undefined,
                amount: Number( amount ),
                createdAt: Date.now(),
            },
            ...prev,
        ] );

        setTitle( "" );
        setDescription( "" );
        setAmount( "" );
        setShowForm( false );
    };

    const deleteExpense = ( id: string ) => {
        setExpenses( ( prev ) => prev.filter( ( e ) => e.id !== id ) );
    };

    return (
        <div className="relative h-full p-4">
            {/* Expense List */ }
            <ul className="space-y-3">
                { expenses.map( ( e ) => (
                    <li
                        key={ e.id }
                        className="grid grid-cols-[auto_1fr_auto] gap-3 items-start rounded-lg border border-neutral-200 p-3"
                    >
                        {/* Column 1: Emoji + Category */ }
                        <div className="flex flex-col items-center gap-1 min-w-[48px]">
                            <span className="text-lg">{ e.category.emoji }</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                                { e.category.name }
                            </span>
                        </div>

                        {/* Column 2: Title + Description */ }
                        <div className="flex flex-col justify-center leading-snug">
                            <span className="font-medium leading-snug">
                                { e.title }
                            </span>
                            { e.description && (
                                <span className="text-sm text-neutral-500 leading-snug">
                                    { e.description }
                                </span>
                            ) }
                        </div>

                        {/* Column 3: Amount + Time + Delete */ }
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-semibold">₹{ e.amount }</span>

                            <span className="text-xs text-neutral-400">
                                { new Date( e.createdAt ).toLocaleTimeString( [], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                } ) }
                            </span>

                            <button
                                onClick={ () => deleteExpense( e.id ) }
                                className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ) ) }
            </ul>

            {/* Add Expense Form (Bottom Sheet) */ }
            { showForm && (
                <div className="fixed inset-0 bg-black/30 flex items-end z-50">
                    <div className="w-full rounded-t-xl bg-background p-4 space-y-3">
                        <select
                            value={ categoryId }
                            onChange={ ( e ) => setCategoryId( e.target.value ) }
                            className="w-full border p-2 rounded"
                        >
                            { categories.map( ( c ) => (
                                <option key={ c.id } value={ c.id }>
                                    { c.emoji } { c.name }
                                </option>
                            ) ) }
                        </select>

                        <input
                            placeholder="Item"
                            value={ title }
                            onChange={ ( e ) => setTitle( e.target.value ) }
                            className="w-full border p-2 rounded"
                        />

                        <input
                            placeholder="Description (optional)"
                            value={ description }
                            onChange={ ( e ) => setDescription( e.target.value ) }
                            className="w-full border p-2 rounded"
                        />

                        <input
                            placeholder="Amount"
                            type="number"
                            value={ amount }
                            onChange={ ( e ) => setAmount( e.target.value ) }
                            className="w-full border p-2 rounded"
                        />

                        <button
                            onClick={ addExpense }
                            className="w-full bg-black text-white py-2 rounded font-medium"
                        >
                            Add Expense
                        </button>
                    </div>
                </div>
            ) }

            {/* Floating Add Button */ }
            <button
                onClick={ () => setShowForm( true ) }
                className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
            >
                <FiPlus size={ 22 } />
            </button>
        </div>
    );
};
