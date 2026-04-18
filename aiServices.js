const categoryKeywords = {
    Food: ["swiggy", "zomato", "restaurant", "food", "dinner", "lunch"],
    Travel: ["uber", "ola", "taxi", "flight", "train"],
    Shopping: ["amazon", "flipkart", "mall", "shopping"],
    Bills: ["electricity", "water", "rent", "bill", "recharge"],
    Entertainment: ["movie", "netflix", "spotify","prime","hotstar"],
  };
  
  const cleanText = (text) => text.toLowerCase().trim();

  export const categorizeExpense = (description = "") => {
    const text = cleanText(description);
  
    for (const category in categoryKeywords) {
      for (const keyword of categoryKeywords[category]) {
        if (text.includes(keyword)) {
          return category;
        }
      }
    }
  
    if (text.includes("petrol") || text.includes("fuel")) return "Travel";
    if (text.includes("grocery")) return "Food";
  
    return "Other";
  };