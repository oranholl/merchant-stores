import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../types';
import * as api from '../services/api';

export const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    cityType: 'big' as 'big' | 'small',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await api.getStores();
      setStores(response.data.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      description: store.description,
      city: store.city,
      cityType: store.cityType,
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || '',
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingStore(null);
    setShowForm(false);
    setFormData({ name: '', description: '', city: '', cityType: 'big', address: '', phone: '', email: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await api.updateStore(editingStore._id, formData);
      } else {
        await api.createStore(formData);
      }
      handleCancelEdit();
      loadStores();
    } catch (error) {
      console.error('Error saving store:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      await api.deleteStore(id);
      loadStores();
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Stores</h1>
        <button 
          onClick={() => {
            setEditingStore(null);
            setFormData({ name: '', description: '', city: '', cityType: 'big', address: '', phone: '', email: '' });
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Store'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingStore ? 'Edit Store' : 'Create New Store'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Store Name"
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
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="form-input"
              />
              <select
                value={formData.cityType}
                onChange={(e) => setFormData({ ...formData, cityType: e.target.value as any })}
                required
                className="form-select"
              >
                <option value="big">Big City</option>
                <option value="small">Small Town</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                {editingStore ? 'Update Store' : 'Create Store'}
              </button>
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stores.length === 0 ? (
        <p className="empty-state">No stores yet. Create your first store!</p>
      ) : (
        <div className="grid-container grid-container-lg">
          {stores.map((store) => (
            <div key={store._id} className="card">
              <div className="card-body card-body-lg">
                <h2>{store.name}</h2>
                <p className="store-info">
                  📍 {store.city} • {store.cityType}
                </p>
                <p>{store.description}</p>
                {store.address && <p><strong>Address:</strong> {store.address}</p>}
                {store.phone && <p><strong>Phone:</strong> {store.phone}</p>}
                <div className="card-actions">
                  <Link 
                    to={`/stores/${store._id}/products`}
                    className="link-btn"
                  >
                    View Products
                  </Link>
                  <button 
                    onClick={() => handleEdit(store)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(store._id)}
                    className="btn btn-danger btn-sm"
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