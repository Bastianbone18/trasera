const { Schema, model } = require("mongoose");

const techProductSchema = new Schema({
  categoria: { type: String, required: true, index: true }, // Ej: Consola, Accesorio, Laptop
  marca: { type: String, required: true, trim: true, index: true },
  modelo: { type: String, required: true, index: true },
  precio: { type: Number, required: true, min: 0, index: true },
  descripcion: { type: String, required: true, minlength: 20 },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Acepta tanto URLs como nombres de archivo simples
        return /^(http|https):\/\/[^ "]+$/.test(v) || /^[^\/\\]+$/.test(v);
      },
      message: props => `${props.value} no es un nombre de archivo o URL válida!`
    }
  },
  stock: { type: Number, default: 5 },
  disponible: { type: Boolean, default: true },
  destacado: { type: Boolean, default: false },
  caracteristicas: { type: [String], default: [] },
  fechaCreacion: { type: Date, default: Date.now }
}, {
  timestamps: true,       // Agrega createdAt y updatedAt automáticamente
  versionKey: false,      // Elimina el campo __v
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para el nombre completo del producto
techProductSchema.virtual('nombreCompleto').get(function () {
  return `${this.marca} ${this.modelo}`;
});

// Middleware para asignar el nombre completo antes de guardar (opcional si realmente necesitas un campo `name`)
techProductSchema.pre('save', function (next) {
  this.name = `${this.marca} ${this.modelo}`;
  next();
});

module.exports = model("TechProduct", techProductSchema);
