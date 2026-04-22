import burger from "@/assets/burger.jpg";
import pizza from "@/assets/pizza.jpg";
import salad from "@/assets/salad.jpg";
import pasta from "@/assets/pasta.jpg";
import latte from "@/assets/latte.jpg";
import juice from "@/assets/juice.jpg";
import mojito from "@/assets/mojito.jpg";
import lavacake from "@/assets/lavacake.jpg";
import tiramisu from "@/assets/tiramisu.jpg";
import cheesecake from "@/assets/cheesecake.jpg";

export type Category = "Food" | "Drinks" | "Desserts";

export type Diet = "Vegetarian" | "Vegan" | "Halal" | "Gluten-Free" | "Spicy";
export type Allergen = "Gluten" | "Dairy" | "Egg" | "Nuts" | "Soy";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  diets: Diet[];
  allergens: Allergen[];
  /** 0-100, higher = healthier */
  healthScore: number;
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  available: boolean;
}

export const categories: Category[] = ["Food", "Drinks", "Desserts"];

export const dietFilters: Diet[] = ["Vegetarian", "Vegan", "Halal", "Gluten-Free", "Spicy"];

export const menuItems: MenuItem[] = [
  {
    id: "f1",
    name: "Classic Beef Burger",
    price: 9.99,
    image: burger,
    description: "Juicy grilled beef patty with cheddar, lettuce & golden fries.",
    category: "Food",
    diets: ["Halal"],
    allergens: ["Gluten", "Dairy"],
    healthScore: 45,
    nutrition: { calories: 720, protein: 38, carbs: 55, fat: 38 },
    available: true,
  },
  {
    id: "f2",
    name: "Margherita Pizza",
    price: 12.5,
    image: pizza,
    description: "Wood-fired pizza with mozzarella, fresh basil & tomato sauce.",
    category: "Food",
    diets: ["Vegetarian", "Halal"],
    allergens: ["Gluten", "Dairy"],
    healthScore: 55,
    nutrition: { calories: 620, protein: 22, carbs: 78, fat: 22 },
    available: true,
  },
  {
    id: "f3",
    name: "Grilled Chicken Salad",
    price: 8.75,
    image: salad,
    description: "Fresh greens, cherry tomatoes & tender grilled chicken.",
    category: "Food",
    diets: ["Halal", "Gluten-Free"],
    allergens: [],
    healthScore: 88,
    nutrition: { calories: 320, protein: 34, carbs: 18, fat: 14 },
    available: true,
  },
  {
    id: "f4",
    name: "Creamy Carbonara",
    price: 11.0,
    image: pasta,
    description: "Silky pasta with parmesan, pancetta & black pepper.",
    category: "Food",
    diets: [],
    allergens: ["Gluten", "Dairy", "Egg"],
    healthScore: 50,
    nutrition: { calories: 680, protein: 26, carbs: 72, fat: 30 },
    available: true,
  },
  {
    id: "d1",
    name: "Iced Caramel Latte",
    price: 4.5,
    image: latte,
    description: "Smooth espresso with caramel and chilled creamy milk.",
    category: "Drinks",
    diets: ["Vegetarian", "Halal"],
    allergens: ["Dairy"],
    healthScore: 60,
    nutrition: { calories: 220, protein: 6, carbs: 28, fat: 9 },
    available: true,
  },
  {
    id: "d2",
    name: "Fresh Orange Juice",
    price: 3.75,
    image: juice,
    description: "Hand-squeezed oranges, served chilled & vitamin packed.",
    category: "Drinks",
    diets: ["Vegan", "Vegetarian", "Halal", "Gluten-Free"],
    allergens: [],
    healthScore: 92,
    nutrition: { calories: 110, protein: 2, carbs: 26, fat: 0 },
    available: true,
  },
  {
    id: "d3",
    name: "Strawberry Mojito",
    price: 5.25,
    image: mojito,
    description: "Refreshing mocktail with strawberries, mint & lime.",
    category: "Drinks",
    diets: ["Vegan", "Vegetarian", "Halal", "Gluten-Free", "Spicy"],
    allergens: [],
    healthScore: 78,
    nutrition: { calories: 140, protein: 1, carbs: 32, fat: 0 },
    available: true,
  },
  {
    id: "ds1",
    name: "Chocolate Lava Cake",
    price: 6.5,
    image: lavacake,
    description: "Warm molten chocolate cake with vanilla ice cream.",
    category: "Desserts",
    diets: ["Vegetarian", "Halal"],
    allergens: ["Gluten", "Dairy", "Egg"],
    healthScore: 30,
    nutrition: { calories: 540, protein: 7, carbs: 65, fat: 28 },
    available: true,
  },
  {
    id: "ds2",
    name: "Classic Tiramisu",
    price: 5.95,
    image: tiramisu,
    description: "Espresso-soaked ladyfingers with mascarpone & cocoa.",
    category: "Desserts",
    diets: ["Vegetarian"],
    allergens: ["Gluten", "Dairy", "Egg"],
    healthScore: 35,
    nutrition: { calories: 480, protein: 8, carbs: 52, fat: 24 },
    available: true,
  },
  {
    id: "ds3",
    name: "Strawberry Cheesecake",
    price: 6.25,
    image: cheesecake,
    description: "Creamy New York cheesecake topped with strawberry sauce.",
    category: "Desserts",
    diets: ["Vegetarian", "Halal"],
    allergens: ["Gluten", "Dairy", "Egg"],
    healthScore: 40,
    nutrition: { calories: 460, protein: 7, carbs: 50, fat: 22 },
    available: true,
  },
];