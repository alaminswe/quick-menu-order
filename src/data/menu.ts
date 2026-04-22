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

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
}

export const categories: Category[] = ["Food", "Drinks", "Desserts"];

export const menuItems: MenuItem[] = [
  {
    id: "f1",
    name: "Classic Beef Burger",
    price: 9.99,
    image: burger,
    description: "Juicy grilled beef patty with cheddar, lettuce & golden fries.",
    category: "Food",
  },
  {
    id: "f2",
    name: "Margherita Pizza",
    price: 12.5,
    image: pizza,
    description: "Wood-fired pizza with mozzarella, fresh basil & tomato sauce.",
    category: "Food",
  },
  {
    id: "f3",
    name: "Grilled Chicken Salad",
    price: 8.75,
    image: salad,
    description: "Fresh greens, cherry tomatoes & tender grilled chicken.",
    category: "Food",
  },
  {
    id: "f4",
    name: "Creamy Carbonara",
    price: 11.0,
    image: pasta,
    description: "Silky pasta with parmesan, pancetta & black pepper.",
    category: "Food",
  },
  {
    id: "d1",
    name: "Iced Caramel Latte",
    price: 4.5,
    image: latte,
    description: "Smooth espresso with caramel and chilled creamy milk.",
    category: "Drinks",
  },
  {
    id: "d2",
    name: "Fresh Orange Juice",
    price: 3.75,
    image: juice,
    description: "Hand-squeezed oranges, served chilled & vitamin packed.",
    category: "Drinks",
  },
  {
    id: "d3",
    name: "Strawberry Mojito",
    price: 5.25,
    image: mojito,
    description: "Refreshing mocktail with strawberries, mint & lime.",
    category: "Drinks",
  },
  {
    id: "ds1",
    name: "Chocolate Lava Cake",
    price: 6.5,
    image: lavacake,
    description: "Warm molten chocolate cake with vanilla ice cream.",
    category: "Desserts",
  },
  {
    id: "ds2",
    name: "Classic Tiramisu",
    price: 5.95,
    image: tiramisu,
    description: "Espresso-soaked ladyfingers with mascarpone & cocoa.",
    category: "Desserts",
  },
  {
    id: "ds3",
    name: "Strawberry Cheesecake",
    price: 6.25,
    image: cheesecake,
    description: "Creamy New York cheesecake topped with strawberry sauce.",
    category: "Desserts",
  },
];