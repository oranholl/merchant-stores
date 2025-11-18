import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Store } from '../types';
import * as api from '../services/api';

export const Products = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (storeId) {
      loadStoreAndProducts();
    }
  }, [storeId]);

  const loadStoreAndProducts = async () => {
    try {
      const [storeRes, productsRes] = await Promise.all([
        api.getStore(storeId!),
        api.getProducts(storeId!)
      ]);
      setStore(storeRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category || '',
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
      };

      if (editingProduct) {
        await api.updateProduct(storeId!, editingProduct._id, productData);
      } else {
        await api.createProduct(storeId!, productData);
      }
      
      handleCancelEdit();
      loadStoreAndProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(storeId!, id);
      loadStoreAndProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/stores')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Stores
      </button>

      <div className="page-header">
        <div>
          <h1>{store?.name} - Products</h1>
          <p>{store?.description}</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Product'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="form-textarea"
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="form-input"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Category (optional)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <p className="empty-state">No products yet. Create your first product!</p>
      ) : (
        <div className="grid-container">
          {products.map((product) => (
            <div key={product._id} className="card">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="card-image"
                />
              )}
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-text">{product.description}</p>
                <div className="card-meta">
                  <span className="card-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ color: '#666' }}>Stock: {product.stock}</span>
                </div>
                {product.category && (
                  <span className="card-badge">
                    {product.category}
                  </span>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button 
                    onClick={() => handleEdit(product)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};