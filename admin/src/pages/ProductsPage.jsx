import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStackStatusBadge } from "../lib/utils";

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // Fetch products
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // Mutation for creating, updating, and deleting a product
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {},
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {},
  });

  const closeModal = () => {
    // reset the state
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setImagePreviews(product.images || []);
    setShowModal(true);
  };
  const handleImageChange = (e) => {};
  const handleSubmit = (e) => {};

  return <div>ProductsPage</div>;
}
