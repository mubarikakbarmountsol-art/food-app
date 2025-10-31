import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  FolderOpen,
  Folder,
  Save,
  ArrowLeft,
  Loader,
  ChevronDown,
  ChevronRight,
  X,
  Filter,
  RefreshCw,
  Image as ImageIcon,
  Package,
  Grid2x2 as Grid,
  List,
  Upload,
  Link,
} from "lucide-react";
import {
  apiService,
  Category,
  CreateUpdateCategoryRequest,
  UpdateCategoryRequest,
} from "../services/api";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [filterType, setFilterType] = useState<"all" | "parent" | "sub">("all");
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">(
    "url"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    categoryName: "",
    shortDescription: "",
    longDescription: "",
    parentCategoryIds: [] as number[],
    isSubCategory: false,
    coverImage: "",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const handleParentCategoryToggle = (categoryId: number) => {
    const newIds = formData.parentCategoryIds.includes(categoryId)
      ? formData.parentCategoryIds.filter((id) => id !== categoryId)
      : [...formData.parentCategoryIds, categoryId];
    handleInputChange("parentCategoryIds", newIds);
  };

  // Check if we're in add or edit mode based on URL
  const isAddMode = location.pathname === "/categories/new";
  const isEditMode = location.pathname === "/categories/update";

  useEffect(() => {
    // Handle edit mode from location state
    if (isEditMode && location.state?.editCategory) {
      const category = location.state.editCategory;
      setFormData({
        categoryName: category.categoryName,
        shortDescription: category.shortDescription,
        longDescription: category.longDescription,
        parentCategoryIds: category.parentCategoryIds || [],
        isSubCategory: category.isSubCategory,
        coverImage: category.coverImage,
      });
      setImagePreview(category.coverImage);
      setEditingCategory(category);
      setShowAddForm(true);
    } else if (isAddMode) {
      resetForm();
      setShowAddForm(true);
    }
  }, [location, isAddMode, isEditMode]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Default demo image
  const DEFAULT_IMAGE =
    "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300";
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAllCategories();

      console.log("Categories API Response:", response);

      if (response.errorCode === 0 && response.data) {
        // Map snake_case to camelCase and ensure parentCategoryIds is always an array
        const mapped = response.data.map((cat: any) => ({
          id: cat.id,
          categoryName: cat.category_name,
          shortDescription: cat.short_description,
          longDescription: cat.long_description,
          isSubCategory: cat.is_sub_category,
          coverImage: cat.cover_image || DEFAULT_IMAGE,
          parentCategoryIds: Array.isArray(cat.parent_categories)
            ? cat.parent_categories.map((p: any) => p.id)
            : [],
          createdAt: cat.created_at || cat.createdAt,
          updatedAt: cat.updated_at || cat.updatedAt,
        }));
        setCategories(mapped);
      } else {
        setError(response.errorMessage || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Failed to load categories",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all parent categories (non-subcategories)
  const parentCategories = categories.filter((cat) => !cat.isSubCategory);

  // Get subcategories for a specific parent
  const getSubCategories = (parentId: number) => {
    return categories.filter(
      (cat) => cat.isSubCategory && cat.parentCategoryIds?.includes(parentId)
    );
  };

  // Build category tree structure
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category & { children: Category[] }>();
    const rootCategories: (Category & { children: Category[] })[] = [];

    // Initialize all categories with children array
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build the tree structure
    categories.forEach((cat) => {
      const categoryWithChildren = categoryMap.get(cat.id)!;

      if (!cat.isSubCategory || !cat.parentCategoryIds?.length) {
        // Root category
        rootCategories.push(categoryWithChildren);
      } else {
        // Sub-category - add to all its parents
        cat.parentCategoryIds.forEach((parentId) => {
          const parent = categoryMap.get(parentId);
          if (parent) {
            parent.children.push(categoryWithChildren);
          }
        });
      }
    });

    return rootCategories;
  };

  // Recursive function to check if category or its children match search
  const categoryMatchesSearch = (
    category: Category,
    searchTerm: string
  ): boolean => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchesName = category.categoryName
      ?.toLowerCase()
      .includes(searchLower);
    const matchesShort = category.shortDescription
      ?.toLowerCase()
      .includes(searchLower);
    const matchesLong = category.longDescription
      ?.toLowerCase()
      .includes(searchLower);

    return matchesName || matchesShort || matchesLong;
  };

  // Recursive function to filter category tree
  const filterCategoryTree = (
    categories: (Category & { children: Category[] })[],
    searchTerm: string,
    filterType: string
  ): (Category & { children: Category[] })[] => {
    return categories.reduce((filtered, category) => {
      const matchesSearch = categoryMatchesSearch(category, searchTerm);
      const matchesFilter =
        filterType === "all" ||
        (filterType === "parent" && !category.isSubCategory) ||
        (filterType === "sub" && category.isSubCategory);

      // Recursively filter children
      const filteredChildren = filterCategoryTree(
        category.children,
        searchTerm,
        filterType
      );

      // Include category if it matches or has matching children
      const shouldInclude =
        (matchesSearch && matchesFilter) || filteredChildren.length > 0;

      if (shouldInclude) {
        filtered.push({
          ...category,
          children: filteredChildren,
        });
      }

      return filtered;
    }, [] as (Category & { children: Category[] })[]);
  };

  // Get category tree and apply filters
  const categoryTree = buildCategoryTree(categories);
  const filteredCategoryTree = filterCategoryTree(
    categoryTree,
    searchTerm,
    filterType
  );

  // Count categories recursively
  const countCategoriesInTree = (
    tree: (Category & { children: Category[] })[]
  ): number => {
    return tree.reduce((count, category) => {
      return count + 1 + countCategoriesInTree(category.children);
    }, 0);
  };

  const filteredCount = countCategoriesInTree(filteredCategoryTree);

  // Recursive component to render category tree
  const CategoryTreeItem = ({
    category,
    level = 0,
  }: {
    category: Category & { children: Category[] };
    level?: number;
  }) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children.length > 0;
    const indentClass = level > 0 ? `ml-${Math.min(level * 4, 16)}` : "";
    const borderColor =
      level === 0
        ? "border-blue-300"
        : level === 1
        ? "border-orange-300"
        : "border-purple-300";

    return (
      <div key={category.id}>
        {/* Category Row */}
        <div
          className={`hover:bg-gray-50 transition-colors ${
            level > 0 ? "bg-gray-25" : ""
          }`}
        >
          <div
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${
              level > 0 ? `border-l-4 ${borderColor} ${indentClass}` : ""
            }`}
          >
            <div className="col-span-1">
              {hasChildren && (
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              )}
            </div>

            <div className="col-span-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`${
                    level > 0 ? "w-10 h-10" : "w-12 h-12"
                  } rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center`}
                >
                  <img
                    src={category.coverImage}
                    alt={category.categoryName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 hidden" />
                </div>
                <div>
                  <h4
                    className={`font-semibold text-gray-800 ${
                      level > 0 ? "text-sm" : ""
                    }`}
                  >
                    {"".repeat(level)}
                    {category.categoryName}
                  </h4>
                  {hasChildren && (
                    <span className="text-xs text-gray-500">
                      {category.children.length} sub-categories
                    </span>
                  )}
                  {level > 0 && (
                    <span className="text-xs text-gray-400">
                      Level {level + 1}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <p
                className={`text-gray-600 line-clamp-2 ${
                  level > 0 ? "text-xs" : "text-sm"
                }`}
              >
                {category.shortDescription}
              </p>
            </div>

            <div className="col-span-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  !category.isSubCategory
                    ? "bg-blue-100 text-blue-800"
                    : level === 0
                    ? "bg-orange-100 text-orange-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {!category.isSubCategory ? "Parent" : `Sub-Level ${level + 1}`}
              </span>
            </div>

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewCategory(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {isExpanded && hasChildren && (
          <div
            className={
              level === 0
                ? "bg-gray-50"
                : level === 1
                ? "bg-gray-100"
                : "bg-gray-150"
            }
          >
            {category.children.map((child) => (
              <CategoryTreeItem
                key={child.id}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const totalCategories = categories.length;
  const parentCategoriesCount = parentCategories.length;
  const subCategoriesCount = categories.filter(
    (cat) => cat.isSubCategory
  ).length;

  const resetForm = () => {
    setFormData({
      categoryName: "",
      shortDescription: "",
      longDescription: "",
      parentCategoryIds: [],
      isSubCategory: false,
      coverImage: "",
    });
    setEditingCategory(null);
    setSelectedFile(null);
    setImagePreview("");
    setImageUploadMethod("url");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange("coverImage", result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddCategory = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      categoryName: category.categoryName,
      shortDescription: category.shortDescription,
      longDescription: category.longDescription,
      parentCategoryIds: category.parentCategoryIds || [],
      isSubCategory: category.isSubCategory,
      coverImage: category.coverImage,
    });
    setImagePreview(category.coverImage);
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (formData.isSubCategory && formData.parentCategoryIds.length === 0) {
        setError("Please select at least one parent category for sub-category");
        setIsSubmitting(false);
        return;
      }

      // Use default image if no image is provided
      const finalCoverImage = formData.coverImage.trim() || DEFAULT_IMAGE;
      const categoryData = {
        ...(editingCategory && { id: editingCategory.id }),
        categoryName: formData.categoryName.trim(),
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription.trim(),
        isSubCategory: formData.isSubCategory,
        coverImage: finalCoverImage,
        parentCategoryIds: formData.isSubCategory
          ? formData.parentCategoryIds
          : [],
      };

      let response;
      if (editingCategory) {
        response = await apiService.updateCategory(
          categoryData as UpdateCategoryRequest
        );
      } else {
        response = await apiService.createUpdateCategory(categoryData);
      }

      if (response && response.errorCode === 0) {
        await loadCategories();
        navigate("/categories");
        resetForm();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Category ${
            editingCategory ? "updated" : "created"
          } successfully`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response?.errorMessage ||
            `Failed to ${editingCategory ? "update" : "create"} category`,
        });
      }
    } catch (error) {
      console.error(
        `Error ${editingCategory ? "updating" : "creating"} category:`,
        error
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : `Failed to ${editingCategory ? "update" : "create"} category`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewCategory = (category: Category) => {
    navigate(`/categories/${category.id}`);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const categoryToDelete = categories.find((cat) => cat.id === categoryId);

      if (!categoryToDelete) {
        throw new Error("Category not found");
      }

      let deletePayload;

      if (
        categoryToDelete.isSubCategory &&
        categoryToDelete.parentCategoryIds?.length > 0
      ) {
        // For subcategories with parent: detach from parent using categoryId and parentCategoryId
        deletePayload = {
          categoryId: categoryId,
          parentCategoryId: categoryToDelete.parentCategoryIds[0],
        };
      } else {
        // For parent categories or orphan categories: soft delete using only categoryId
        deletePayload = {
          categoryId: categoryId,
        };
      }

      console.log("Deleting category with payload:", deletePayload);

      const response = await apiService.deleteCategory(deletePayload);

      if (response.success) {
        await loadCategories();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleRefresh = () => {
    loadCategories();
  };

  if (showAddForm) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                  navigate("/categories", { replace: true });
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Categories</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-gray-600">
              {editingCategory
                ? "Update category information"
                : "Create a new category for your products"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Type Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Category Type
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("isSubCategory", false);
                    handleInputChange("parentCategoryIds", []);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !formData.isSubCategory
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                  disabled={isSubmitting}
                >
                  <Folder className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Parent Category</div>
                  <div className="text-sm">Main category</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("isSubCategory", true)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.isSubCategory
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                  disabled={isSubmitting}
                >
                  <FolderOpen className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Sub Category</div>
                  <div className="text-sm">Under parent</div>
                </button>
              </div>
            </div>

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
                    value={formData.categoryName}
                    onChange={(e) =>
                      handleInputChange("categoryName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter category name"
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                {/* Parent Category Selection for Sub Categories */}
                {formData.isSubCategory && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Parent Categories *
                    </label>
                    <div className="relative">
                      {/* Trigger */}
                      <div
                        onClick={() =>
                          setShowCategoryDropdown(!showCategoryDropdown)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white min-h-[48px] flex items-center justify-between"
                      >
                        <div className="flex-1">
                          {formData.parentCategoryIds.length === 0 ? (
                            <span className="text-gray-500">
                              Select parent categories...
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {formData.parentCategoryIds
                                .slice(0, 3)
                                .map((id) => {
                                  const category = categories.find(
                                    (cat) => cat.id === id
                                  );
                                  return category ? (
                                    <span
                                      key={id}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                    >
                                      <img
                                        src={category.coverImage}
                                        alt={category.categoryName}
                                        className="w-4 h-4 rounded-full object-cover"
                                      />
                                      {category.categoryName}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInputChange(
                                            "parentCategoryIds",
                                            formData.parentCategoryIds.filter(
                                              (cid) => cid !== id
                                            )
                                          );
                                        }}
                                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ) : null;
                                })}
                              {formData.parentCategoryIds.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{formData.parentCategoryIds.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dropdown menu */}
                      {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {categories
                              .filter((cat) => !cat.isSubCategory) // only parent categories
                              .map((category) => (
                                <label
                                  key={category.id}
                                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.parentCategoryIds.includes(
                                      category.id
                                    )}
                                    onChange={() =>
                                      handleParentCategoryToggle(category.id)
                                    }
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                  />
                                  <img
                                    src={category.coverImage}
                                    alt={category.categoryName}
                                    className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                                  />
                                  <span className="text-sm font-medium text-gray-800">
                                    {category.categoryName}
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.parentCategoryIds.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        Please select at least one parent category
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Cover Image
              </h3>

              {/* Image Upload Method Selection */}
              <div className="mb-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMethod("url");
                      setSelectedFile(null);
                      setImagePreview("");
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      imageUploadMethod === "url"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    disabled={isSubmitting}
                  >
                    <Link className="w-4 h-4" />
                    <span>Image URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMethod("upload");
                      handleInputChange("coverImage", "");
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      imageUploadMethod === "upload"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    disabled={isSubmitting}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
              {/* Image URL Input */}
              {imageUploadMethod === "url" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => {
                      handleInputChange("coverImage", e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter image URL or leave empty for default"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* File Upload Input */}
              {imageUploadMethod === "upload" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PNG, JPG, GIF up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1 mx-auto"
                      disabled={isSubmitting}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Choose File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {(imagePreview || formData.coverImage) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={imagePreview || formData.coverImage || DEFAULT_IMAGE}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      <p>This is how your category image will appear</p>
                      {!imagePreview && !formData.coverImage && (
                        <p className="text-gray-500 mt-1">
                          Default image will be used if no image is provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                  navigate("/categories", { replace: true });
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>
                      {editingCategory ? "Update Category" : "Create Category"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
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
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "parent" | "sub")
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Categories</option>
              <option value="parent">Parent Only</option>
              <option value="sub">Sub Categories Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Loading Categories
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your categories...
          </p>
        </div>
      )}

      {/* Categories Table Accordion */}
      {!loading && categories.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Categories
              </h3>
              <p className="text-sm text-gray-600">
                Showing {filteredCount} of {categories.length} categories
              </p>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1"></div>
              <div className="col-span-4">Category Name</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Render category tree */}
            {filteredCategoryTree.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && !error && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Categories Found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first category to organize your
            products.
          </p>
          <button
            onClick={handleAddCategory}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Category</span>
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading &&
        categories.length > 0 &&
        filteredCategoryTree.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Categories Match Your Search
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFilterType("all");
              }}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
    </div>
  );
}
