import React, { useState, useEffect } from "react";
import "./Home.css"; // Ensure the path is correct
import FoodItem from "../../components/foodItem/FoodItem"; // Ensure the path is correct
import { supabase } from "../../utils/supabase"; // Ensure the Supabase client is correctly set up

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [foodItems, setFoodItems] = useState([]);

  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetchFoodItems();
  }, []);

  async function fetchFoodItems() {
    try {
      let { data: foods, error } = await supabase.from("foods").select("*");

      if (error) {
        throw error;
      }
      console.log(foods);

      setFoodItems(foods);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  }

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
  };

  const filteredItems = foodItems.filter(
    (item) => selectedTag === "all" || item.tags.includes(selectedTag)
  );

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="home-div">
      {/* Tag selection buttons */}
      <div className="tag-selection">
        {["all", "starters", "main", "dessert", "drink"].map((tag) => (
          <button
            key={tag}
            className={selectedTag === tag ? "active" : ""}
            onClick={() => handleTagChange(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid of filtered food items */}
      <div className="food-grid">
        {filteredItems.map((item) => (
          <FoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
