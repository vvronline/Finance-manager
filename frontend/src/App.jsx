import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:8000';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [report, setReport] = useState(null);
    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        category: '',
        description: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const fetchReport = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        try {
            const response = await axios.get(`${API_URL}/reports/monthly/${year}/${month}`);
            setReport(response.data);
        } catch (error) {
            console.error("Error fetching report", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchReport();
    }, []);

    const handleInputChange = (e) => {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/transactions/`, newTransaction);
            setNewTransaction({
                amount: '',
                category: '',
                description: '',
                type: 'expense',
                date: new Date().toISOString().split('T')[0]
            });
            fetchTransactions();
            fetchReport();
        } catch (error) {
            console.error("Error adding transaction", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        window.location.href = `${API_URL}/reports/download/${year}/${month}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Finance Manager</h1>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Download size={20} />
                        Download Report
                    </button>
                </div>

                {/* Summary Cards */}
                {
                    report && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Income</p>
                                        <p className="text-2xl font-bold text-gray-800">${report.total_income.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                                        <TrendingDown size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Expenses</p>
                                        <p className="text-2xl font-bold text-gray-800">${report.total_expense.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Balance</p>
                                        <p className={`text-2xl font-bold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${report.balance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Transaction Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Transaction</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                                            className={`py-2 rounded-lg border ${newTransaction.type === 'income' ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-600'}`}
                                        >
                                            Income
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                                            className={`py-2 rounded-lg border ${newTransaction.type === 'expense' ? 'bg-red-50 border-red-200 text-red-700' : 'border-gray-200 text-gray-600'}`}
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        value={newTransaction.amount}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={newTransaction.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Food, Salary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={newTransaction.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Optional details"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newTransaction.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                                >
                                    <PlusCircle size={20} />
                                    Add Transaction
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart */}
                        {report && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Overview</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Income', amount: report.total_income },
                                        { name: 'Expenses', amount: report.total_expense }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                                            <th className="pb-3 font-medium">Date</th>
                                            <th className="pb-3 font-medium">Category</th>
                                            <th className="pb-3 font-medium">Description</th>
                                            <th className="pb-3 font-medium text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="text-sm">
                                                <td className="py-3 text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-600">{t.description}</td>
                                                <td className={`py-3 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    No transactions yet. Add one to get started!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default App;
