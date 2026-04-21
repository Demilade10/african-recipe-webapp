import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BASE_RECIPES, Recipe } from '../../data/recipes.ts';
import { Calendar, Plus, Trash2, ChevronRight, Clock } from 'lucide-react';

export const MealPlanner: React.FC = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [planner, setPlanner] = useState<Record<string, Recipe[]>>({
    "Monday": [BASE_RECIPES[0]],
    "Wednesday": [BASE_RECIPES[1]]
  });
  const [showAddModal, setShowAddModal] = useState<string | null>(null);

  const addRecipeToDay = (day: string, recipe: Recipe) => {
    setPlanner(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), recipe]
    }));
    setShowAddModal(null);
  };

  const removeRecipe = (day: string, index: number) => {
    setPlanner(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <p className="serif italic text-2xl text-terracotta mb-2">Curated Nourishment</p>
          <h2 className="text-6xl font-serif text-ink tracking-tight">Weekly <span className="italic">Ritual.</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {days.map((day) => (
          <div key={day} className="glass-card p-8 rounded-[32px] flex flex-col md:flex-row gap-8 items-start md:items-center group hover:border-gold/30 transition-all duration-500">
            <div className="w-48 shrink-0">
              <h3 className="font-serif text-3xl text-forest italic leading-none">{day}</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-gold mt-2">Daily Sustenance</p>
            </div>

            <div className="flex-1 flex flex-wrap gap-4">
              {planner[day]?.map((recipe, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${day}-${i}`}
                  className="bg-white px-6 py-4 rounded-2xl border border-sep shadow-sm flex items-center gap-4 group/item hover:border-terracotta transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-sep">
                    <img src={recipe.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink leading-tight">{recipe.title}</h4>
                    <p className="text-[10px] text-forest/50 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.cookingTime} Min
                    </p>
                  </div>
                  <button 
                    onClick={() => removeRecipe(day, i)}
                    className="ml-4 p-2 text-sep hover:text-terracotta transition-colors opacity-0 group-hover/item:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              <button 
                onClick={() => setShowAddModal(day)}
                className="w-12 h-12 rounded-2xl border-2 border-dashed border-sep flex items-center justify-center text-sep hover:text-gold hover:border-gold transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-parchment flex items-center justify-center text-sep group-hover:bg-gold/10 group-hover:text-gold transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Basic Search Modal for Adding Recipes */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[200] flex items-center justify-center p-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-10 border-b border-sep flex justify-between items-center">
                <h3 className="font-serif text-4xl text-ink">Add to <span className="italic">{showAddModal}</span></h3>
                <button onClick={() => setShowAddModal(null)} className="p-3 bg-sep/10 rounded-full hover:bg-sep/20 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 gap-4">
                {BASE_RECIPES.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => addRecipeToDay(showAddModal, r)}
                    className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-sep hover:border-terracotta transition-all text-left shadow-sm group"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                      <img src={r.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-2xl text-ink group-hover:text-terracotta transition-colors">{r.title}</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-forest/40">{r.tribe} Heritage</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center text-sep group-hover:bg-terracotta group-hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
