import React, { useState, useEffect } from "react";
import "./Home.css";
import FoodItem from "../../components/foodItem/FoodItem";
import { supabase } from "../../utils/supabase";

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [foodItems, setFoodItems] = useState([]);

  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  }

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
  };

  const filteredItems = foodItems.filter(
    (item) => selectedTag === "all" || item.tags.includes(selectedTag)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-div">
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

      <div className="food-grid">
        {filteredItems.map((item) => (
          <FoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
