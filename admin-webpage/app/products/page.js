"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

function ProductsContent() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const result = await api.getProducts(token);
      setProducts(result.products || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const startEdit = (product) => {
    setEditing(product.id);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      bestseller: product.bestseller || false,
    });
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      await api.updateProduct(token, editing, editForm);
      setEditing(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-gray-900 mb-6">Products</h1>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400 bg-white rounded-lg p-8 text-center">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">
                {editing === product.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Name"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Category"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.bestseller}
                        onChange={(e) => setEditForm({ ...editForm, bestseller: e.target.checked })}
                      />
                      Bestseller
                    </label>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-brand-purple text-white text-sm rounded hover:bg-brand-purple-dark"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        ${product.price || "0.00"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1.5">
                        {product.bestseller && (
                          <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                            Bestseller
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          product.inStock !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.inStock !== false ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <button
                        onClick={() => startEdit(product)}
                        className="text-sm text-brand-purple hover:text-brand-purple-dark"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AdminLayout>
      <ProductsContent />
    </AdminLayout>
  );
}
