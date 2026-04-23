import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Función para calcular la edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 0; // Evita errores con fechas inválidas

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age < 0 ? 0 : age; // Asegura que la edad no sea negativa
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const edad = calculateAge(formData.fecha_nacimiento);

    try {
      const { error } = await supabase
        .from('estudiantes')
        .insert([
          {
            ...formData,
            edad: edad
          }
        ]);

      if (error) throw error;

      setMessage({ type: 'success', text: '¡Estudiante registrado con éxito!' });
      setFormData({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        email: '',
        telefono: '',
        direccion: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Registro de Estudiantes</h1>
        <p className="subtitle">Completa los datos para inscribir al nuevo alumno</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                placeholder="Ej. Pérez"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
              {formData.fecha_nacimiento && (
                <span className="age-badge">Edad: {calculateAge(formData.fecha_nacimiento)} años</span>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="+57 310 123 ..."
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle 123"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-register">
            {loading ? 'Registrando...' : 'Registrar Estudiante'}
          </button>

          {message.text && (
            <div className={`alert ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
