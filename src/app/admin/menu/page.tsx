"use client";

import { useState } from "react";
import { menuItems, categories, cuisines as cuisineData } from "@/data/seed-menu";
import { MenuForm } from "@/components/admin/MenuForm";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

// Build lookup
const catToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  catToCuisine[cat.slug] = cat.cuisine_slug;
});
const cuisineSlugToName: Record<string, string> = {};
cuisineData.forEach((c) => {
  cuisineSlugToName[c.slug] = c.name;
});
const getCuisineName = (catSlug: string) =>
  cuisineSlugToName[catToCuisine[catSlug]] || catSlug;

export default function AdminMenuPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<(typeof menuItems)[0] | null>(null);
  const [search, setSearch] = useState("");

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      getCuisineName(item.category_slug).toLowerCase().includes(search.toLowerCase())
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    // In production, this would call the API
    console.log("Submit menu item:", data);
    setShowForm(false);
    setEditingItem(null);
    alert(editingItem ? "Item updated (demo mode)" : "Item added (demo mode)");
  };

  const handleDelete = (itemName: string) => {
    if (confirm(`Delete "${itemName}"? This cannot be undone.`)) {
      console.log("Delete:", itemName);
      alert("Item deleted (demo mode)");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="mt-1 text-gray-500">
            {menuItems.length} items across 6 cuisines
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Add New Item</Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Item
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Cuisine
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Price
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Calories
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Diet
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Spice
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {getCuisineName(item.category_slug)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {item.calories} cal
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {item.is_vegetarian && (
                        <Badge variant="success">Veg</Badge>
                      )}
                      {item.is_vegan && <Badge variant="info">Vegan</Badge>}
                      {item.is_gluten_free && (
                        <Badge variant="default">GF</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {"🌶️".repeat(item.spice_level) || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(item);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        title={editingItem ? `Edit: ${editingItem.name}` : "Add New Menu Item"}
        size="lg"
      >
        <MenuForm
          initialData={
            editingItem
              ? {
                  name: editingItem.name,
                  description: editingItem.description,
                  price: editingItem.price.toString(),
                  cuisine_id: getCuisineName(editingItem.category_slug),
                  category_id: editingItem.category_slug,
                  is_vegetarian: editingItem.is_vegetarian,
                  is_vegan: editingItem.is_vegan,
                  is_gluten_free: editingItem.is_gluten_free,
                  spice_level: editingItem.spice_level.toString(),
                  calories: editingItem.calories.toString(),
                  protein: editingItem.protein_g.toString(),
                  carbs: editingItem.carbs_g.toString(),
                  fat: editingItem.fat_g.toString(),
                  is_available: true,
                  mood_tags: editingItem.mood_tags.join(", "),
                  keywords: editingItem.keywords.join(", "),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          isEditing={!!editingItem}
        />
      </Modal>
    </div>
  );
}
