import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Users, Utensils, CreditCard, Filter, ChevronRight, MoreVertical } from 'lucide-react';
import { BASE_RECIPES } from '../../data/recipes.ts';
import { db } from '../../lib/firebase.ts';
import { collection, query, getDocs, limit } from 'firebase/firestore';

export const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"recipes" | "users" | "transactions">("recipes");
  const [stats, setStats] = useState({ users: 1240, transactions: 85, revenue: 127500 });

  const filteredRecipes = BASE_RECIPES.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.tribe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="serif italic text-2xl text-terracotta mb-2">Operational Excellence</p>
          <h2 className="text-6xl font-serif text-ink tracking-tight">Admin <span className="italic">Command.</span></h2>
        </div>
        
        {/* Unified Admin Search Bar */}
        <div className="flex items-center gap-3 bg-forest text-white px-6 py-3 rounded-full shadow-xl w-full md:w-auto">
          <Search className="w-4 h-4 opacity-70" />
          <input 
            type="text" 
            placeholder={`Search ${activeView}...`}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest placeholder:text-white/50 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Community", value: stats.users, icon: Users, color: "text-forest" },
          { label: "Premium Sales", value: stats.transactions, icon: CreditCard, color: "text-terracotta" },
          { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "text-gold" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[32px] flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-serif font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full bg-parchment flex items-center justify-center ${stat.color} border border-sep`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* View Switcher */}
      <div className="flex gap-4 border-b border-sep pb-4">
        {["recipes", "users", "transactions"].map((view) => (
          <button
            key={view}
            onClick={() => { setActiveView(view as any); setSearchQuery(""); }}
            className={`text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full transition-all ${
              activeView === view ? 'bg-forest text-white shadow-lg' : 'text-forest/40 hover:text-forest'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-card rounded-[40px] overflow-hidden">
        {activeView === "recipes" && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sep/5 border-b border-sep">
                <th className="p-6 text-[10px] uppercase font-black tracking-widest opacity-40">Recipe</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest opacity-40">Tribe</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest opacity-40">Tier</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest opacity-40">Cook Time</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sep">
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-parchment transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-sep">
                        <img src={recipe.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-serif text-xl text-ink underline decoration-sep group-hover:decoration-terracotta transition-all">{recipe.title}</span>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold uppercase text-forest/60">{recipe.tribe}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${recipe.isPremium ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-forest/10 text-forest border border-forest/20'}`}>
                      {recipe.isPremium ? 'Premium' : 'Standard'}
                    </span>
                  </td>
                  <td className="p-6 text-xs font-medium text-forest/40">{recipe.cookingTime} mins</td>
                  <td className="p-6 text-right">
                    <button className="p-2 text-sep hover:text-terracotta transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {activeView !== "recipes" && (
          <div className="p-32 text-center">
            <div className="w-20 h-20 bg-sep/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-sep" />
            </div>
            <h3 className="font-serif text-3xl text-ink mb-2">Database Connection Active</h3>
            <p className="text-sm text-forest/60 max-w-sm mx-auto font-medium leading-relaxed">
              Real-time {activeView} data is being streamed from the heritage database. Use the search bar above to filter administrative records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
