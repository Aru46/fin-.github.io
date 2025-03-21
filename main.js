import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const categories = ["Еда", "Транспорт", "Развлечения", "Здоровье", "Прочее"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function IncomeTracker() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState("Доход");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!amount) return;
    const newTransaction = { id: Date.now(), amount: parseFloat(amount), category, type };
    setTransactions([...transactions, newTransaction]);
    setAmount("");
  };

  const summary = transactions.reduce(
    (acc, t) => {
      acc[t.type] += t.amount;
      return acc;
    },
    { Доход: 0, Расход: 0 }
  );

  const categoryData = categories.map((cat, i) => ({
    name: cat,
    value: transactions.filter(t => t.category === cat && t.type === "Расход").reduce((acc, t) => acc + t.amount, 0),
    color: COLORS[i]
  })).filter(d => d.value > 0);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Учет доходов и расходов</h1>
      <div className="flex gap-2 mb-4">
        <input type="number" placeholder="Сумма" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 w-full" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2">
          <option value="Доход">Доход</option>
          <option value="Расход">Расход</option>
        </select>
        <Button onClick={addTransaction}>Добавить</Button>
      </div>
      <h2 className="text-lg font-bold">Статистика</h2>
      <p>Доход: {summary["Доход"]} ₽ | Расход: {summary["Расход"]} ₽</p>
      <div className="flex gap-4 mt-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height={200}>
          <BarChart data={transactions.filter(t => t.type === "Расход")}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
