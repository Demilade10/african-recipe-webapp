import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, User, Search, Utensils, Heart } from 'lucide-react';
import { auth, googleProvider } from './lib/firebase.ts';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase.ts';
import { BASE_RECIPES, Recipe } from './data/recipes.ts';
import { RecipeDetail } from './components/recipe/RecipeDetail.tsx';
import { AIAssistant } from './components/ai/AIAssistant.tsx';
import { SavedRecipes } from './components/dashboard/SavedRecipes.tsx';
import { MealPlanner } from './components/dashboard/MealPlanner.tsx';
import { AdminDashboard } from './components/dashboard/AdminDashboard.tsx';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTribe, setFilterTribe] = useState("All");
  const [activeTab, setActiveTab] = useState<"home" | "saved" | "planner" | "admin">("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          // Initialize profile
          const initialProfile = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            role: "user",
            subscriptionStatus: "premium", // Giving premium by default since no paystack key
            savedRecipes: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, initialProfile);
          setUserProfile(initialProfile);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleSaveRecipe = async (recipeId: string) => {
    if (!user || !userProfile) return;
    
    const isSaved = userProfile.savedRecipes?.includes(recipeId);
    const newSaved = isSaved 
      ? userProfile.savedRecipes.filter((id: string) => id !== recipeId)
      : [...(userProfile.savedRecipes || []), recipeId];
    
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { ...userProfile, savedRecipes: newSaved });
    setUserProfile({ ...userProfile, savedRecipes: newSaved });
  };

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const filteredRecipes = BASE_RECIPES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.tribe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTribe = filterTribe === "All" || r.tribe === filterTribe;
    return matchesSearch && matchesTribe;
  });

  return (
    <div className="min-h-screen bg-parchment selection:bg-gold/30 text-ink">
      {/* Header */}
      <nav className="bg-white/40 backdrop-blur-md sticky top-0 z-50 border-b border-sep px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => { setSelectedRecipe(null); setActiveTab("home"); }}
          >
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gold transform rotate-45 group-hover:rotate-180 transition-transform duration-700"></div>
            </div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight uppercase">
              CHOP<span className="text-terracotta">WELL</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex gap-8 text-xs font-semibold uppercase tracking-widest text-forest">
              <a 
                href="#" 
                className={activeTab === "home" ? "border-b border-terracotta" : "opacity-50 hover:opacity-100 transition-opacity"} 
                onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); setActiveTab("home"); }}
              >
                Home
              </a>
              <a 
                href="#" 
                className={activeTab === "saved" ? "border-b border-terracotta" : "opacity-50 hover:opacity-100 transition-opacity"} 
                onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); setActiveTab("saved"); }}
              >
                Saved
              </a>
              <a 
                href="#" 
                className={activeTab === "planner" ? "border-b border-terracotta" : "opacity-50 hover:opacity-100 transition-opacity"} 
                onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); setActiveTab("planner"); }}
              >
                Meal Plans
              </a>
              {userProfile?.role === 'admin' && (
                <a 
                  href="#" 
                  className={activeTab === "admin" ? "border-b border-terracotta" : "opacity-50 hover:opacity-100 transition-opacity"} 
                  onClick={(e) => { e.preventDefault(); setSelectedRecipe(null); setActiveTab("admin"); }}
                >
                  Admin
                </a>
              )}
            </nav>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] uppercase tracking-tighter opacity-60">Welcome back</p>
                  <p className="text-sm font-semibold">{user.displayName}</p>
                </div>
                <div className="relative group">
                  <button onClick={logout} className="w-10 h-10 rounded-full bg-terracotta border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                    {user.displayName?.[0] || 'U'}
                  </button>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-gold border-2 border-white rounded-full"></span>
                </div>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {selectedRecipe ? (
            <RecipeDetail 
              key="detail"
              recipe={selectedRecipe} 
              onBack={() => setSelectedRecipe(null)}
              isUnlocked={userProfile?.subscriptionStatus === 'premium'}
              isSaved={userProfile?.savedRecipes?.includes(selectedRecipe.id)}
              onToggleSave={toggleSaveRecipe}
            />
          ) : activeTab === "home" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Hero/Filters */}
              <div className="mb-16">
                <p className="serif italic text-2xl text-terracotta mb-2">The Art of Traditional Cooking</p>
                <h2 className="text-7xl md:text-8xl font-serif text-ink mb-10 leading-[0.9] tracking-tight">
                  Taste the Soul <br/>of <span className="italic">Nigeria.</span>
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex items-center gap-3 bg-forest text-white px-6 py-3 rounded-full shadow-xl">
                    <Search className="w-4 h-4 opacity-70" />
                    <input 
                      type="text" 
                      placeholder="Search by Tribe..."
                      className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest placeholder:text-white/50 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Yoruba", "Igbo", "Hausa", "Owambe Special"].map(tribe => (
                      <button
                        key={tribe}
                        onClick={() => tribe === "Owambe Special" ? setSearchQuery("Owambe") : setFilterTribe(tribe)}
                        className={`px-4 py-2 border border-sep rounded-full text-xs font-semibold hover:bg-white transition-colors ${
                          (filterTribe === tribe || (tribe === "Owambe Special" && searchQuery === "Owambe")) ? 'bg-white shadow-sm border-terracotta/30' : ''
                        }`}
                      >
                        {tribe}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="glass-card p-4 rounded-3xl flex flex-col gap-4 group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-terracotta/30 relative"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
                      className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-terracotta shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-5 h-5 ${userProfile?.savedRecipes?.includes(recipe.id) ? 'fill-current' : ''}`} />
                    </button>
                    <div className="relative aspect-square bg-terracotta/5 rounded-2xl overflow-hidden">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="serif text-5xl text-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 uppercase tracking-widest text-center px-4">
                          {recipe.title.split(' ')[0]}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-ink">
                        {recipe.cookingTime} Min
                      </div>
                    </div>
                    <div className="px-1 py-2">
                       <h3 className="serif text-2xl font-semibold text-ink mb-1 group-hover:text-terracotta transition-colors tracking-tight">
                        {recipe.title}
                      </h3>
                      <p className="text-[11px] text-forest uppercase tracking-[0.2em] opacity-60 font-bold">
                        {recipe.tribe} Heritage • {recipe.occasion}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === "saved" ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SavedRecipes 
                savedIds={userProfile?.savedRecipes || []}
                onSelectRecipe={setSelectedRecipe}
                onToggleSave={toggleSaveRecipe}
              />
            </motion.div>
          ) : activeTab === "planner" ? (
            <motion.div
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MealPlanner />
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 bg-parchment border-t border-sep px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-ink/70">
            <a href="#" className="hover:text-terracotta transition-colors">Facebook</a>
            <a href="#" className="hover:text-terracotta transition-colors">Instagram</a>
            <a href="#" className="hover:text-terracotta transition-colors">Twitter</a>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-ink">English</span>
            <span className="opacity-30">Yoruba</span>
            <span className="opacity-30">Igbo</span>
            <span className="opacity-30">Hausa</span>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">
            © 2024 ChopWell Inc. Artisanal Digital Dining.
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}

// Icon helper since I changed LogOut name later
function LogOut(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
