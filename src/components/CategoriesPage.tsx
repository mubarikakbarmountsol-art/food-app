import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  Folder,
  Image,
  Upload,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  parentName?: string;
  mainImage: string;
  bannerImage: string;
  status: "active" | "inactive";
  productsCount: number;
  createdDate: string;
}

const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Pizza",
    parentId: null,
    mainImage:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300",
    bannerImage:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    productsCount: 12,
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    parentId: "1",
    parentName: "Pizza",
    mainImage:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300",
    bannerImage:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    productsCount: 3,
    createdDate: "2024-01-16",
  },
  {
    id: "3",
    name: "Burgers",
    parentId: null,
    mainImage:
      "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=300",
    bannerImage:
      "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    productsCount: 8,
    createdDate: "2024-01-20",
  },
  {
    id: "4",
    name: "Cheese Burger",
    parentId: "3",
    parentName: "Burgers",
    mainImage:
      "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=300",
    bannerImage:
      "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    productsCount: 2,
    createdDate: "2024-01-21",
  },
  {
    id: "5",
    name: "Desserts",
    parentId: null,
    mainImage:
      "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300",
    bannerImage:
      "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    productsCount: 5,
    createdDate: "2024-01-25",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    parentId: "",
    isParent: true,
    mainImage: "",
    bannerImage: "",
  });

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.parentName &&
        category.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const totalCategories = categories.length;
  const parentCategoriesCount = parentCategories.length;
  const subCategoriesCount = categories.filter(
    (cat) => cat.parentId !== null
  ).length;

  const handleAddCategory = () => {
    setShowAddForm(true);
    setFormData({
      name: "",
      shortDescription: "",
      longDescription: "",
      parentId: "",
      isParent: true,
      mainImage: "",
      bannerImage: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: formData.name,
      parentId: formData.isParent ? null : formData.parentId || null,
      parentName: formData.isParent
        ? undefined
        : parentCategories.find((p) => p.id === formData.parentId)?.name,
      mainImage:
        formData.mainImage ||
        "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300",
      bannerImage:
        formData.bannerImage ||
        "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "active",
      productsCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setCategories([...categories, newCategory]);
    setShowAddForm(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  if (showAddForm) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Categories</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Category
            </h1>
            <p className="text-gray-600">
              Create a new category for your products
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Category Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleInputChange("shortDescription", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter short description (max 100 characters)"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) =>
                      handleInputChange("longDescription", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter detailed description of the category"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="isParent"
                      checked={formData.isParent}
                      onChange={(e) =>
                        handleInputChange("isParent", e.target.checked)
                      }
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isParent"
                      className="text-sm font-medium text-gray-700"
                    >
                      This is a parent category
                    </label>
                  </div>

                  {!formData.isParent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category *
                      </label>
                      <select
                        value={formData.parentId}
                        onChange={(e) =>
                          handleInputChange("parentId", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required={!formData.isParent}
                      >
                        <option value="">Select parent category</option>
                        {parentCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload main image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        // Handle file upload here
                        console.log("Main image file:", e.target.files?.[0]);
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      onClick={() =>
                        document.querySelector('input[type="file"]')?.click()
                      }
                    >
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload banner image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        // Handle file upload here
                        console.log("Banner image file:", e.target.files?.[0]);
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      onClick={() =>
                        document
                          .querySelectorAll('input[type="file"]')[1]
                          ?.click()
                      }
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Create Category</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                📁 Categories Management
              </h1>
              <p className="text-gray-600">
                Organize your products with categories and subcategories
              </p>
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {totalCategories}
                </p>
                <p className="text-sm text-blue-700">Total Categories</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {parentCategoriesCount}
                </p>
                <p className="text-sm text-green-700">Parent Categories</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {subCategoriesCount}
                </p>
                <p className="text-sm text-orange-700">Sub Categories</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={category.mainImage}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.parentId
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {category.parentId ? "Sub Category" : "Parent Category"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {category.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {category.parentId ? (
                      <FolderOpen className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Folder className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>

                {category.parentName && (
                  <p className="text-gray-600 text-sm mb-2">
                    Parent: {category.parentName}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {category.productsCount} products
                  </span>
                  <span className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(category.createdDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewCategory(category)}
                    className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedCategory.bannerImage}
                alt={selectedCategory.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute top-4 left-4 flex space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedCategory.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory.parentId
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedCategory.parentId
                    ? "Sub Category"
                    : "Parent Category"}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Category Info */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedCategory.name}
                  </h2>
                  {selectedCategory.parentName && (
                    <p className="text-gray-600">
                      Parent Category: {selectedCategory.parentName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedCategory.productsCount}
                  </div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Main Image
                  </h3>
                  <img
                    src={selectedCategory.mainImage}
                    alt={`${selectedCategory.name} main`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Banner Image
                  </h3>
                  <img
                    src={selectedCategory.bannerImage}
                    alt={`${selectedCategory.name} banner`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Category Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Created Date:</span>
                    <p className="font-medium">
                      {new Date(
                        selectedCategory.createdDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-medium capitalize">
                      {selectedCategory.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Edit Category
                </button>
                <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                  View Products
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
