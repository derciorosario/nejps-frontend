import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import DefaultAdminLayout from '../../layout/DefaultAdminLayout';
import { useData } from '../../../contexts/DataContext';

export default function GalleryApp() {
  const data = useData();
  const [categories, setCategories] = useState([{ id: 0, name_pt: 'Todos', name_en: 'All' }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryPt, setNewCategoryPt] = useState('');
  const [newCategoryEn, setNewCategoryEn] = useState('');

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, imagesRes] = await Promise.all([
          axios.get(data.APP_BASE_URL + '/api/categories'),
          axios.get(data.APP_BASE_URL + '/api/gallery'),
        ]);

        setCategories([{ id: 0, name_pt: 'Todos', name_en: 'All' }, ...categoriesRes.data]);
        setImages(imagesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Erro ao carregar dados da galeria.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data.APP_BASE_URL]);

  const handleCategorySelect = (id) => setSelectedCategoryId(id);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || selectedCategoryId == 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('categoryId', selectedCategoryId);

      const response = await axios.post(`${data.APP_BASE_URL}/api/upload-image`, formData);
      setImages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Erro ao enviar imagem!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

    setLoading(true);
    try {
      await axios.get(`${data.APP_BASE_URL}/api/delete-image/${id}`);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Erro ao excluir imagem!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryPt.trim() || !newCategoryEn.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${data.APP_BASE_URL}/api/add-category`, {
        name_pt: newCategoryPt.trim(),
        name_en: newCategoryEn.trim(),
      });

      setCategories(prev => [...prev, response.data.category]);
      setNewCategoryPt('');
      setNewCategoryEn('');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Erro ao adicionar categoria!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Deseja realmente apagar a categoria e todas as imagens associadas?')) return;

    setLoading(true);
    try {
      await axios.get(`${data.APP_BASE_URL}/api/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setImages(prev => prev.filter(img => img.categoryId !== id));
      if (selectedCategoryId == id) setSelectedCategoryId(0);
    } catch (error) {
      console.error('Erro ao apagar categoria:', error);
      alert('Erro ao apagar categoria!');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategoryId == 0
    ? images
    : images.filter(img => img.categoryId == selectedCategoryId);

  return (
    <DefaultAdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Gestão de Galeria</h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map(category => (
            <div key={category.id} className="relative flex items-center gap-1">
              <button
                onClick={() => handleCategorySelect(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                  selectedCategoryId == category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {category.name_pt}
              </button>
              {category.id !== 0 && (
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-gray-500 hover:text-red-700 text-xs"
                  title="Apagar categoria"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Category */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Nome (pt)"
              value={newCategoryPt}
              onChange={(e) => setNewCategoryPt(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-64 focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Nome (en)"
              value={newCategoryEn}
              onChange={(e) => setNewCategoryEn(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-64 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Categoria'}
          </button>
        </div>

        {/* Upload */}
        <div className="flex flex-col items-center mb-10">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={selectedCategoryId == 0}
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition ${
              selectedCategoryId == 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaPlus />
            Carregar Imagem
          </label>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredImages.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden shadow-md">
              <img
                src={`${data.APP_BASE_URL}/file/${img.url?.replaceAll(' ', '%20')}`}
                alt="Uploaded"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 max-md:opacity-100 group-hover:opacity-100 transition"
                title="Remover"
              >
                &times;
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm py-1">
                {categories.find(c => c.id == img.categoryId)?.name_pt}
              </div>
            </div>
          ))}
        </div>

        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3 shadow-xl">
              <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
              <span>Processando...</span>
            </div>
          </div>
        )}
      </div>

    </DefaultAdminLayout>
  );
}
