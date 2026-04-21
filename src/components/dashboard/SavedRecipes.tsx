import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Recipe, BASE_RECIPES } from '../../data/recipes.ts';
import { Heart, Search } from 'lucide-react';

interface SavedRecipesProps {
  savedIds: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (id: string) => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({ savedIds, onSelectRecipe, onToggleSave }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const savedRecipes = BASE_RECIPES.filter(r => 
    savedIds?.includes(r.id) &&
    (r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.tribe.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="serif italic text-2xl text-terracotta mb-2">Your Personal Collection</p>
          <h2 className="text-6xl font-serif text-ink tracking-tight">Saved <span className="italic">Treasures.</span></h2>
        </div>
        
        {/* User Search Bar for Saved Recipes */}
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-sep shadow-sm w-full md:w-auto">
          <Search className="w-4 h-4 text-forest/40" />
          <input 
            type="text" 
            placeholder="Search your archive..."
            className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest placeholder:text-forest/30 w-full md:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden md:block text-[10px] uppercase font-black tracking-[0.2em] text-forest/40 pb-2">
          {savedRecipes.length} Authentic Recipes
        </div>
      </div>

      {savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card p-4 rounded-3xl flex flex-col gap-4 group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-terracotta/30 relative"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(recipe.id); }}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-terracotta shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              
              <div onClick={() => onSelectRecipe(recipe)}>
                <div className="relative aspect-square bg-terracotta/5 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="serif text-2xl font-semibold text-ink group-hover:text-terracotta transition-colors tracking-tight">
                  {recipe.title}
                </h3>
                <p className="text-[11px] text-forest uppercase tracking-[0.2em] opacity-60 font-bold">
                  {recipe.tribe} Heritage
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center glass-card rounded-[40px] border-dashed border-sep">
          <div className="w-20 h-20 bg-sep/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-sep" />
          </div>
          <h3 className="font-serif text-3xl text-ink mb-2">No Saved Recipes Yet</h3>
          <p className="text-sm text-forest/60 max-w-xs mx-auto font-medium">
            Browse our collection and tap the archive icon to save your favorite African flavors.
          </p>
        </div>
      )}
    </div>
  );
};
