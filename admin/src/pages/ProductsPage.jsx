import { useState } from "react"
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productAPI } from "../lib/api"
import { getStockStatusBadge } from "../lib/utils"

export default function ProductsPage() {

    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [imagePreviews, setImagePreviews] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: ""
    })
    const [images, setImages] = useState([])
    const { data: productsData } = useQuery({
        queryKey: ["products"],
        queryFn: productAPI.getAll
    })
    const createProductMutation = useMutation({
        mutationFn: productAPI.create,
        onSuccess: () => {
            closeModal()
            queryClient.invalidateQueries({ queryKey: ["products"] })
        }
    })
    const deleteProductMutation = useMutation({
        mutationFn: productAPI.delete,
        onSuccess: () => {
            closeModal()
            queryClient.invalidateQueries({ queryKey: ["products"] })
        }
    })
    const updateProductMutation = useMutation({
        mutationFn: productAPI.update,
        onSuccess: () => {
            closeModal()
            queryClient.invalidateQueries({ queryKey: ["products"] })
        }
    })
    const closeModal = () => {
        setShowModal(false)
        setEditingProduct(null)
        setImages([])
        setImagePreviews([])
        setFormData({
            name: "",
            description: "",
            category: "",
            price: "",
            stock: ""
        })
    }
    const handleEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            stock: product.stock.toString(),
            price: product.price.toString()
        })
        setImages(product.images)
        setShowModal(true)
    }
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 3) return alert("Maximum 3 images allowed")
        setImages(files)
        setImagePreviews(files.map(file => URL.createObjectURL(file)))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!editingProduct && images.length === 0) {
            return alert("Please upload atleast 1 image")
        }
        const formDataToSend = new FormData()
        formDataToSend.append("name", formData.name)
        formDataToSend.append("description", formData.description)
        formDataToSend.append("category", formData.category)
        formDataToSend.append("stock", formData.stock)
        formDataToSend.append("price", formData.price)

        if (images.length > 0) images.forEach(image => formDataToSend.append("images", image))
        if (editingProduct) {
            updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend })
        } else {
            createProductMutation.mutate({ formData: formDataToSend })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-base-content/70 mt-1">Manage your product inventory</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
                    <PlusIcon className="size-5" />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {
                    productsData?.products.map(product => {
                        const status = getStockStatusBadge(product.status)
                        return (
                            <div key={product._id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center gap-6">
                                        <div className="avatar">
                                            <div className="w-20 rounded-xl">
                                                <img src={product.images[0]} alt={product.name} />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="card-title">{product.name}</h3>
                                                    <p className="text-base-content/70 text-sm">{product.category}</p>
                                                </div>
                                                <div className={`badge ${status.class}`}>{status.text}</div>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4">
                                                <div>
                                                    <p className="text-xs text-base-content/70">Price</p>
                                                    <p className="font-bold text-lg">${product.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-base-content/70">Stock</p>
                                                    <p className="font-bold text-lg">{product.stock} units</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button
                                                className="btn btn-square btn-ghost"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="btn btn-square btn-ghost text-error"
                                                onClick={() => deleteProductMutation.mutate(product._id)}
                                            >
                                                {deleteProductMutation.isPending ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <Trash2Icon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <input type="checkbox" className="modal-toggle" checked={showModal} />

            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-2xl">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h3>

                        <button onClick={closeModal} className="btn btn-circle btn-ghost">
                            <X className="size-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label htmlFor="label">
                                    <span>
                                        Products Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    className="input mt-2 rounded-lg"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="label">
                                    <span>
                                        Category
                                    </span>
                                </label>
                                <select
                                    className="select mt-2 rounded-lg"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label htmlFor="label">
                                    <span>
                                        Price ($)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input mt-2 rounded-lg"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="label">
                                    <span>
                                        Stock
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="input mt-2 rounded-lg"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label htmlFor="label">
                                <span>
                                    Description
                                </span>
                            </label>
                            <textarea
                                className="textarea mt-2 h-24 w-full rounded-lg"
                                placeholder="Enter product description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label mb-2">
                                <span className="label-text font-semibold text-base flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Product Images
                                </span>
                                <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
                            </label>

                            <div className="bg-base-200 rounded-lg p-4 border-2 border-dashed border-base-300 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input file-input-bordered file-input-primary w-full rounded-lg file:rounded-l-lg"
                                    required={!editingProduct}
                                />

                                {editingProduct && (
                                    <p className="text-xs text-base-content/60 mt-2 text-center">
                                        Leave empty to keep current images
                                    </p>
                                )}
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="avatar">
                                            <div className="w-20 rounded-lg">
                                                <img src={preview} alt={`Preview ${index + 1}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn"
                                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            >
                                {createProductMutation.isPending || updateProductMutation.isPending ? (
                                    <span className="loading loading-spinner"></span>
                                ) : editingProduct ? (
                                    "Update Product"
                                ) : (
                                    "Add Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
