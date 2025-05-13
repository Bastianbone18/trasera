const TechProduct = require("../models/techProduct.model");

// Obtener todos los productos con filtros básicos
const getProducts = async (req, res) => {
  try {
    const { categoria, marca, minPrice, maxPrice } = req.query;
    const filter = {};

    if (categoria) filter.categoria = categoria;
    if (marca) filter.marca = marca;

    if (minPrice || maxPrice) {
      filter.precio = {};
      if (minPrice) filter.precio.$gte = Number(minPrice);
      if (maxPrice) filter.precio.$lte = Number(maxPrice);
    }

    const products = await TechProduct.find(filter).sort({ precio: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
};

// Búsqueda avanzada con paginación
const advancedSearch = async (req, res) => {
  try {
    const {
      categoria,
      marca,
      modelo,
      minPrice,
      maxPrice,
      sortBy = 'precio',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (categoria) filter.categoria = categoria;
    if (marca) filter.marca = new RegExp(marca, 'i');
    if (modelo) filter.modelo = new RegExp(modelo, 'i');

    if (minPrice || maxPrice) {
      filter.precio = {};
      if (minPrice) filter.precio.$gte = parseFloat(minPrice);
      if (maxPrice) filter.precio.$lte = parseFloat(maxPrice);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await TechProduct.countDocuments(filter);
    const products = await TechProduct.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ total, page: parseInt(page), totalPages: Math.ceil(total / limit), products });
  } catch (error) {
    res.status(500).json({ message: "Error en búsqueda avanzada", error: error.message });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await TechProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el producto", error: error.message });
  }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
  try {
    const {
      categoria,
      marca,
      modelo,
      precio,
      descripcion,
      imagenes,
      stock = 5,
      disponible = true,
      destacado = false,
      caracteristicas = []
    } = req.body;

    if (!categoria || !marca || !modelo || !precio || !descripcion || !imagenes || imagenes.length === 0) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const newProduct = new TechProduct({
      categoria,
      marca,
      modelo,
      precio: parseFloat(precio),
      descripcion,
      imagenes,
      stock,
      disponible,
      destacado,
      caracteristicas
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const product = await TechProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const updatedProduct = await TechProduct.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await TechProduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  advancedSearch
};
