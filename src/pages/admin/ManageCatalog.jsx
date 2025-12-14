import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/firebase-config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './styles/ManageCatalog.css';

const ManageCatalog = () => {
    const navigate = useNavigate();
    const [minerals, setMinerals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Formulario
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        images: [] // Guardará URLs
    });

    const [imageFiles, setImageFiles] = useState([]); // Archivos crudos para subir

    const mineralsCollection = collection(db, "minerals");

    // 1. Cargar minerales existentes
    const fetchMinerals = async () => {
        const data = await getDocs(mineralsCollection);
        setMinerals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    useEffect(() => {
        fetchMinerals();
    }, []);

    // 2. Manejar selección de imágenes
    const handleImageChange = (e) => {
        if (e.target.files) {
            // Convertimos FileList a Array
            const filesArray = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...filesArray]);
        }
    };

    // 3. Subir mineral
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrls = [];

            // Subir cada imagen a Storage
            for (const file of imageFiles) {
                const storageRef = ref(storage, `catalog/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }

            // Guardar en Firestore
            await addDoc(mineralsCollection, {
                name: newItem.name,
                description: newItem.description,
                images: imageUrls,
                createdAt: new Date()
            });

            // Resetear form
            setNewItem({ name: '', description: '', images: [] });
            setImageFiles([]);
            alert("Mineral añadido al catálogo");
            fetchMinerals();

        } catch (error) {
            console.error("Error:", error);
            alert("Error al subir el mineral");
        } finally {
            setLoading(false);
        }
    };

    // 4. Borrar mineral
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de borrar este mineral?")) {
            await deleteDoc(doc(db, "minerals", id));
            fetchMinerals();
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn">← Volver</button>
                <h1>Gestor de Catálogo</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario de Subida */}
                <div className="upload-section">
                    <h2>Añadir Nuevo Mineral</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre del Mineral"
                            className="admin-input"
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Descripción detallada..."
                            className="admin-textarea"
                            value={newItem.description}
                            onChange={e => setNewItem({...newItem, description: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label>Imágenes (puedes seleccionar varias):</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                            />
                        </div>

                        {/* Previsualización de nombres de archivos */}
                        <div className="files-preview">
                            {imageFiles.map((file, idx) => (
                                <span key={idx} className="file-tag">{file.name}</span>
                            ))}
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Subiendo...' : 'Publicar en Catálogo'}
                        </button>
                    </form>
                </div>

                {/* Lista de Minerales */}
                <div className="list-section">
                    <h2>Inventario Actual</h2>
                    <div className="minerals-list">
                        {minerals.map(mineral => (
                            <div key={mineral.id} className="mineral-item-admin">
                                <img src={mineral.images[0]} alt={mineral.name} />
                                <div className="mineral-info">
                                    <h3>{mineral.name}</h3>
                                    <p>{mineral.images.length} imágenes</p>
                                </div>
                                <button onClick={() => handleDelete(mineral.id)} className="delete-btn">Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCatalog;