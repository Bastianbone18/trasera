const { Schema, model } = require("mongoose");

const techProductSchema = new Schema({
  categoria: { type: String, required: true, index: true }, // Ej: Consola, Accesorio, Laptop
  marca: { type: String, required: true, trim: true, index: true },
  modelo: { type: String, required: true, index: true },
  precio: { type: Number, required: true, min: 0, index: true },
  descripcion: { type: String, required: true, minlength: 20 },
  imagenes: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length >= 1 && v.length <= 5,
      message: 'Debe tener entre 1 y 5 imágenes'
    }
  },
  stock: { type: Number, default: 5 },
  disponible: { type: Boolean, default: true },
  destacado: { type: Boolean, default: false },
  caracteristicas: { type: [String], default: [] },
  fechaCreacion: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

techProductSchema.virtual('nombreCompleto').get(function () {
  return `${this.marca} ${this.modelo}`;
});

techProductSchema.pre('save', function (next) {
  this.name = this.nombreCompleto;
  next();
});

module.exports = model("TechProduct", techProductSchema);
