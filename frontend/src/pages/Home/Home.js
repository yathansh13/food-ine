import React, { useState } from "react";
import { foodItems } from "../../data"; // Adjust the path as necessary
import "./Home.css"; // Assuming you have a CSS file for styling
import FoodItem from "../../components/foodItem/FoodItem"; // Adjust the path as necessary

// HomePage component
export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState("all");

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
  };

  const filteredItems = foodItems.filter(
    (item) => selectedTag === "all" || item.tags.includes(selectedTag)
  );

  return (
    <div className="home-div">
      {/* Tag selection buttons */}
      <div className="tag-selection">
        <button
          className={selectedTag === "all" ? "active" : ""}
          onClick={() => handleTagChange("all")}
        >
          All
        </button>
        <button
          className={selectedTag === "starters" ? "active" : ""}
          onClick={() => handleTagChange("starters")}
        >
          Starters
        </button>
        <button
          className={selectedTag === "main" ? "active" : ""}
          onClick={() => handleTagChange("main")}
        >
          Main
        </button>
        <button
          className={selectedTag === "desert" ? "active" : ""}
          onClick={() => handleTagChange("desert")}
        >
          Desert
        </button>
        <button
          className={selectedTag === "drink" ? "active" : ""}
          onClick={() => handleTagChange("drink")}
        >
          Drink
        </button>
      </div>

      {/* Grid of filtered food items */}
      <div className="food-grid">
        {/* Existing code for tag selection and food grid... */}
        {filteredItems.map((item) => (
          <FoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
