export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  ingredients: string[];
  tribe: "Yoruba" | "Igbo" | "Hausa" | "General";
  cookingTime: number; // in minutes
  occasion: string;
  isPremium: boolean;
  imageUrl: string;
}

export const BASE_RECIPES: Recipe[] = [
  {
    id: "jollof-rice",
    title: "Party Jollof Rice",
    description: "The legendary smoky Nigerian Jollof rice, a staple of every Owambe.",
    ingredients: [
      "3 cups Long-grain parboiled rice",
      "5 Large Red bell peppers (Tatashe)",
      "3 Scotch bonnet peppers (Ata rodo)",
      "5 Large Tomatoes",
      "2 Onions",
      "1/2 cup Vegetable oil",
      "2 tbsp Tomato paste",
      "Beef or Chicken stock",
      "Curry, Thyme, Bay leaves, Boullion cubes"
    ],
    instructions: [
      "Blend the peppers, tomatoes, and one onion into a smooth paste. Boil to reduce the water content.",
      "Heat oil in a large pot, sauté sliced onions, then add tomato paste and fry for 5 minutes.",
      "Add the boiled pepper mix and fry until oil separates from the mix.",
      "Season with curry, thyme, bay leaves, and bouillon cubes.",
      "Add washed rice and meat stock. Cover with foil and a lid to trap steam.",
      "Cook on low heat until rice is tender and bottom is slightly charred for that smoky flavor."
    ],
    tribe: "General",
    cookingTime: 60,
    occasion: "Owambe",
    isPremium: false,
    imageUrl: "https://picsum.photos/seed/jollof/800/600"
  },
  {
    id: "egusi-soup",
    title: "Egusi Soup (Lumpy Style)",
    description: "A rich, nutty soup made from melon seeds and leafy greens.",
    ingredients: [
      "2 cups Ground melon seeds (Egusi)",
      "Palm oil",
      "Assorted Meat & Fish",
      "Ground crayfish",
      "Spinach or Ugwu leaves",
      "Seasoning cubes & Salt"
    ],
    instructions: [
      "Mix ground egusi with a little water to form a thick paste.",
      "Heat palm oil in a pot, add the egusi paste in small lumps. Fry for 10 minutes.",
      "Add meat stock and pre-cooked assorted meats. Simmer for 15 minutes.",
      "Add crayfish and seasoning. Adjust taste.",
      "Add chopped spinach or ugwu leaves. Cook for 3 minutes and remove from heat."
    ],
    tribe: "Igbo",
    cookingTime: 45,
    occasion: "Casual",
    isPremium: false,
    imageUrl: "https://picsum.photos/seed/egusi/800/600"
  },
  {
    id: "efo-riro",
    title: "Efo Riro",
    description: "Authentic Yoruba vegetable soup, rich in flavor and assorted meats.",
    ingredients: [
      "Spinach leaves (Soko or Tete)",
      "Palm oil",
      "Coarsely blended peppers",
      "Dried fish and Stockfish",
      "Iru (Locust beans)",
      "Assorted cow tripe (Shaki)"
    ],
    instructions: [
      "Blanch the spinach in hot water and squeeze out excess water.",
      "Heat palm oil, add sliced onions and locust beans (iru).",
      "Add blended peppers and fry until translucent.",
      "Add cooked meats and dried fish. Simmer.",
      "Stir in the spinach and cook for 2 minutes. Serve hot with Pounded Yam."
    ],
    tribe: "Yoruba",
    cookingTime: 40,
    occasion: "Owambe",
    isPremium: true,
    imageUrl: "https://picsum.photos/seed/efo/800/600"
  }
];
