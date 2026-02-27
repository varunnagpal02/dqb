"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface MenuFormData {
  name: string;
  description: string;
  price: string;
  cuisine_id: string;
  category_id: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  is_available: boolean;
  mood_tags: string;
  keywords: string;
}

interface MenuFormProps {
  initialData?: Partial<MenuFormData> & { id?: string };
  onSubmit: (data: MenuFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function MenuForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: MenuFormProps) {
  const [formData, setFormData] = useState<MenuFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    cuisine_id: initialData?.cuisine_id || "",
    category_id: initialData?.category_id || "",
    is_vegetarian: initialData?.is_vegetarian || false,
    is_vegan: initialData?.is_vegan || false,
    is_gluten_free: initialData?.is_gluten_free || false,
    spice_level: initialData?.spice_level || "0",
    calories: initialData?.calories || "",
    protein: initialData?.protein || "",
    carbs: initialData?.carbs || "",
    fat: initialData?.fat || "",
    is_available: initialData?.is_available !== false,
    mood_tags: initialData?.mood_tags || "",
    keywords: initialData?.keywords || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        id: initialData?.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Item Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Butter Chicken"
          required
        />
        <Input
          label="Price *"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="14.99"
          required
        />
      </div>

      <Textarea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="A rich, creamy tomato-based curry..."
        rows={3}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine *
          </label>
          <select
            name="cuisine_id"
            value={formData.cuisine_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Select cuisine</option>
            <option value="north-indian">North Indian</option>
            <option value="south-indian">South Indian</option>
            <option value="indo-chinese">Indo-Chinese</option>
            <option value="street-food">Street Food</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            <option value="appetizers">Appetizers</option>
            <option value="mains">Mains</option>
            <option value="breads">Breads</option>
            <option value="rice">Rice</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
      </div>

      {/* Macros */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Nutritional Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Calories"
            name="calories"
            type="number"
            value={formData.calories}
            onChange={handleChange}
            placeholder="350"
          />
          <Input
            label="Protein (g)"
            name="protein"
            type="number"
            value={formData.protein}
            onChange={handleChange}
            placeholder="25"
          />
          <Input
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={formData.carbs}
            onChange={handleChange}
            placeholder="30"
          />
          <Input
            label="Fat (g)"
            name="fat"
            type="number"
            value={formData.fat}
            onChange={handleChange}
            placeholder="12"
          />
        </div>
      </div>

      {/* Spice Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Spice Level (0-5)
        </label>
        <input
          type="range"
          name="spice_level"
          min="0"
          max="5"
          value={formData.spice_level}
          onChange={handleChange}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mild</span>
          <span>🌶️ Level {formData.spice_level}</span>
          <span>🔥🔥🔥</span>
        </div>
      </div>

      {/* Dietary Flags */}
      <div className="flex flex-wrap gap-4">
        {[
          { name: "is_vegetarian", label: "🥬 Vegetarian" },
          { name: "is_vegan", label: "🌱 Vegan" },
          { name: "is_gluten_free", label: "🌾 Gluten-Free" },
          { name: "is_available", label: "✅ Available" },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              checked={formData[name as keyof MenuFormData] as boolean}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mood Tags (comma-separated)"
          name="mood_tags"
          value={formData.mood_tags}
          onChange={handleChange}
          placeholder="comfort, party, celebration"
        />
        <Input
          label="Keywords (comma-separated)"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="creamy, spicy, tandoori"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
