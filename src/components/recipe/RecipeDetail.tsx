import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, Flame, ChevronLeft, Bookmark, Lock, Heart } from 'lucide-react';
import { Recipe } from '../../data/recipes.ts';
import { PaystackButton } from '../payment/PaystackButton.tsx';

interface RecipeDetailProps {
  recipe: Recipe;
  isUnlocked?: boolean;
  onBack?: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  isUnlocked = false, 
  onBack,
  isSaved = false,
  onToggleSave
}) => {
  const needsPremium = recipe.isPremium && !isUnlocked;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-forest mb-12 hover:text-terracotta transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-[10px] tracking-[0.2em] font-black">Back to Recipes</span>
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full aspect-[3/4] object-cover rounded-[40px] shadow-2xl grayscale-[10%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-8 flex flex-col gap-2">
            <span className="bg-forest text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              {recipe.tribe}
            </span>
            {recipe.isPremium && (
              <span className="premium-gradient text-white px-5 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest shadow-lg">
                <Lock className="w-3 h-3" /> Premium
              </span>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-serif text-ink leading-tight mb-6 tracking-tight">
              {recipe.title}
            </h1>
            <p className="text-terracotta text-2xl font-serif italic mb-10">
              "{recipe.description}"
            </p>

            <div className="flex flex-wrap gap-8 mb-12 pb-10 border-b border-sep">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sep" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{recipe.cookingTime} mins</span>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-sep" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{recipe.occasion}</span>
              </div>
              <button 
                onClick={() => onToggleSave?.(recipe.id)}
                className="flex items-center gap-3 group/save"
              >
                <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-terracotta text-terracotta' : 'text-sep group-hover/save:text-terracotta'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${isSaved ? 'opacity-100 text-terracotta' : 'opacity-60 group-hover/save:opacity-100'}`}>
                  {isSaved ? 'Saved to Archive' : 'Archive Recipe'}
                </span>
              </button>
            </div>

            {needsPremium ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-10 rounded-[40px] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6 text-gold">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-3xl tracking-tight">Artisanal Secret</h3>
                  </div>
                  <p className="text-sm text-forest/70 mb-8 leading-relaxed font-medium">
                    This traditional heritage preparation is part of our Elite Collection. Subscribe to access the nuanced flavor profiles and meticulous hand-crafting techniques.
                  </p>
                  <PaystackButton amount={1500} className="w-full h-16 rounded-2xl shadow-xl hover:shadow-gold/20" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div>
                  <h3 className="text-xs font-black text-forest uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                    <span>Ingredients Checklist</span>
                    <div className="h-px flex-1 bg-sep" />
                  </h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-forest/80 group">
                        <div className="w-5 h-5 rounded-md border border-sep mt-0.5 group-hover:bg-gold/10 transition-colors shrink-0" />
                        <span className="text-sm font-medium tracking-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-black text-forest uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                    <span>Meticulous Method</span>
                    <div className="h-px flex-1 bg-sep" />
                  </h3>
                  <ol className="space-y-10">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-6 group">
                        <span className="font-serif text-5xl text-sep group-hover:text-gold/30 transition-colors shrink-0 leading-none">0{i + 1}</span>
                        <p className="text-ink leading-relaxed pt-2 font-medium">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
