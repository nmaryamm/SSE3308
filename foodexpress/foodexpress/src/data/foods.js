export const categories = [
  { name: 'All', icon: '/cuisine-icons/all.png' },
  { name: 'Malay', icon: '/cuisine-icons/malay.png' },
  { name: 'Chinese', icon: '/cuisine-icons/chinese.png' },
  { name: 'Western', icon: '/cuisine-icons/western.png' },
  { name: 'Japanese', icon: '/cuisine-icons/japanese.png' },
  { name: 'Korean', icon: '/cuisine-icons/korean.png' },
  { name: 'Drinks', icon: '/cuisine-icons/drinks.png' },
  { name: 'Desserts', icon: '/cuisine-icons/desserts.png' },
]

const initialFoods = [
  {
    id: 1,
    name: 'Nasi Lemak Ayam Goreng',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 9.9,
    rating: '4.9',
    time: '25–35 min',
    label: 'Bestseller',
    specialOffer: true,
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
    description:
      'Fragrant coconut rice with crispy golden chicken, sambal, crunchy anchovies, peanuts, and fresh cucumber.',
  },
  {
    id: 9,
    name: 'Nasi Lemak Rendang',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 13.9,
    rating: '4.8',
    time: '25–35 min',
    label: 'House special',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    description:
      'Coconut rice served with slow-cooked beef rendang, sambal, crunchy anchovies, peanuts, and cucumber.',
  },
  {
    id: 10,
    name: 'Ayam Masak Merah with Rice',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 12.5,
    rating: '4.7',
    time: '25–35 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
    description:
      'Steamed rice with tender chicken simmered in a gently spicy tomato and chilli sauce.',
  },
  {
    id: 11,
    name: 'Kampung Fried Rice',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 10.9,
    rating: '4.8',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    description:
      'Fragrant village-style fried rice with vegetables, egg, anchovies, and a side of sambal.',
  },
  {
    id: 12,
    name: 'Mee Kari',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 11.5,
    rating: '4.7',
    time: '25–35 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
    description:
      'Yellow noodles in a rich, aromatic curry broth with tofu puffs, vegetables, and lime.',
  },
  {
    id: 13,
    name: 'Satay Chicken Set',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 14.5,
    rating: '4.9',
    time: '25–35 min',
    label: 'Popular',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85',
    description:
      'Grilled chicken skewers with peanut sauce, cucumber, onions, and compressed rice cakes.',
  },
  {
    id: 14,
    name: 'Soto Ayam',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 10.5,
    rating: '4.7',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
    description:
      'A comforting bowl of spiced chicken soup with noodles, herbs, and a squeeze of lime.',
  },
  {
    id: 15,
    name: 'Nasi Ayam',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 11.9,
    rating: '4.8',
    time: '25–35 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
    description:
      'Ginger-scented rice with juicy chicken, fresh cucumber, and a savoury chilli dipping sauce.',
  },
  {
    id: 16,
    name: 'Ikan Bakar Set',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 16.9,
    rating: '4.8',
    time: '30–40 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85',
    description:
      'Grilled fish brushed with spicy sambal, served with rice and crunchy fresh vegetables.',
  },
  {
    id: 17,
    name: 'Kuih Seri Muka',
    restaurant: 'Warung Senja',
    category: 'Desserts',
    price: 5.5,
    rating: '4.8',
    time: '15–25 min',
    label: 'Sweet treat',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85',
    description:
      'A traditional two-layer kuih with fragrant pandan custard over soft glutinous rice.',
  },
  {
    id: 2,
    name: 'Cheesy Chicken Burger',
    restaurant: 'Burger Society',
    category: 'Western',
    price: 12.9,
    rating: '4.8',
    time: '20–30 min',
    label: 'Fan favourite',
    specialOffer: true,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    description:
      'A juicy grilled chicken burger stacked with melty cheese, crisp lettuce, tomato, and our house sauce.',
  },
  {
    id: 3,
    name: 'Mee Goreng Mamak',
    restaurant: 'Mamak Corner',
    category: 'Malay',
    price: 8.5,
    rating: '4.8',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
    description:
      'Wok-fried noodles tossed in a savoury, gently spicy sauce with vegetables and a squeeze of lime.',
  },
  {
    id: 4,
    name: 'Bubble Milk Tea',
    restaurant: 'Boba & Co.',
    category: 'Drinks',
    price: 6.9,
    rating: '4.7',
    time: '15–25 min',
    label: 'Cool pick',
    specialOffer: true,
    image:
      'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=85',
    description:
      'Creamy milk tea with chewy tapioca pearls. Choose your sweetness and add a little extra yum.',
  },
  {
    id: 5,
    name: 'Salmon Sushi Set',
    restaurant: 'Sushi Zanmai',
    category: 'Japanese',
    price: 18.9,
    rating: '4.9',
    time: '25–35 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
    description:
      'A fresh assortment of salmon nigiri and rolls served with pickled ginger, wasabi, and soy.',
  },
  {
    id: 6,
    name: 'Korean Crispy Chicken',
    restaurant: 'Seoul Kitchen',
    category: 'Korean',
    price: 16.5,
    rating: '4.8',
    time: '30–40 min',
    label: 'So crispy',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85',
    description:
      'Crunchy Korean-style chicken glazed in a sweet and savoury sauce with a sprinkle of sesame.',
  },
  {
    id: 7,
    name: 'Wok Hei Fried Rice',
    restaurant: 'Little Wok',
    category: 'Chinese',
    price: 10.5,
    rating: '4.7',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    description:
      'Fluffy rice stir-fried over a hot wok with egg, fresh vegetables, and classic house seasoning.',
  },
  {
    id: 8,
    name: 'Strawberry Cheesecake',
    restaurant: 'Butter & Crumb',
    category: 'Desserts',
    price: 9.5,
    rating: '4.9',
    time: '20–30 min',
    label: 'Sweet treat',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85',
    description:
      'A silky vanilla cheesecake on a buttery biscuit base, finished with ripe strawberries.',
  },
]

const additionalMenus = {
  'Burger Society': [
    'Classic Beef Burger',
    'Crispy Chicken Burger',
    'Double Smash Burger',
    'BBQ Bacon Burger',
    'Mushroom Swiss Burger',
    'Spicy Chicken Burger',
    'Crispy Chicken Tenders',
    'Loaded Cheese Fries',
    'Onion Rings',
  ],
  'Mamak Corner': [
    'Roti Canai with Dhal',
    'Roti Telur',
    'Nasi Goreng Kampung',
    'Maggi Goreng',
    'Chicken Tandoori',
    'Roti Tissue',
    'Mee Goreng Ayam',
    'Nasi Kandar Ayam',
    'Teh Tarik',
  ],
  'Boba & Co.': [
    'Brown Sugar Milk Tea',
    'Jasmine Green Milk Tea',
    'Taro Milk Tea',
    'Matcha Latte with Pearls',
    'Mango Fruit Tea',
    'Passionfruit Tea',
    'Strawberry Milk Tea',
    'Honeydew Smoothie',
    'Classic Iced Lemon Tea',
  ],
  'Sushi Zanmai': [
    'California Roll',
    'Spicy Tuna Roll',
    'Salmon Nigiri',
    'Unagi Don',
    'Chicken Katsu Don',
    'Tempura Udon',
    'Salmon Sashimi',
    'Dragon Roll',
    'Miso Soup and Edamame Set',
  ],
  'Seoul Kitchen': [
    'Beef Bulgogi Bowl',
    'Bibimbap',
    'Kimchi Fried Rice',
    'Japchae Noodles',
    'Korean Beef Short Ribs',
    'Spicy Tteokbokki',
    'Crispy Seafood Pancake',
    'Korean Fried Chicken Wings',
    'Bulgogi Kimbap',
  ],
  'Little Wok': [
    'Chicken Chow Mein',
    'Sweet and Sour Chicken',
    'Beef Black Pepper Stir-Fry',
    'Kung Pao Chicken',
    'Vegetable Spring Rolls',
    'Crispy Lemon Chicken',
    'Mapo Tofu with Rice',
    'Chicken Wonton Soup',
    'Honey Garlic Prawns',
  ],
  'Butter & Crumb': [
    'Classic New York Cheesecake',
    'Chocolate Fudge Brownie',
    'Lemon Meringue Tart',
    'Salted Caramel Cupcake',
    'Red Velvet Cake Slice',
    'Blueberry Muffin',
    'Chocolate Chip Cookie',
    'Banana Bread Slice',
    'Vanilla Butter Croissant',
  ],
}

let nextFoodId = Math.max(...initialFoods.map((food) => food.id)) + 1
const priceStepByCategory = {
  Drinks: 0.5,
  Desserts: 0.55,
  Japanese: 1.25,
  Korean: 1.15,
  Western: 1.1,
  Chinese: 0.95,
  Malay: 0.85,
}

export const foods = [
  ...initialFoods,
  ...Object.entries(additionalMenus).flatMap(([restaurant, menu]) => {
    const sample = initialFoods.find((food) => food.restaurant === restaurant)
    const priceStep = priceStepByCategory[sample.category] ?? 1

    return menu.map((name, index) => ({
      id: nextFoodId++,
      name,
      restaurant,
      category: sample.category,
      price: Number((Number(sample.price) + priceStep * (index + 1)).toFixed(2)),
      rating: sample.rating,
      time: sample.time,
      label: index === 0 ? 'Popular' : '',
      specialOffer: index === 2,
      image: sample.image,
      description: `${name}, freshly prepared and served by ${restaurant}.`,
    }))
  }),
]

export const restaurants = [...new Set(foods.map((food) => food.restaurant))].map(
  (name) => {
    const menu = foods.filter((food) => food.restaurant === name)
    return {
      name,
      category: menu[0].category,
      rating: menu.reduce((sum, food) => sum + Number(food.rating), 0) / menu.length,
      time: menu[0].time,
      image: menu[0].image,
      menu,
    }
  },
)
