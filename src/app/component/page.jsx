"use client";
import useRegister from "../lib/useRegister";
import React, { useMemo, useState, useEffect } from "react";

// Componente Toast para mostrar alertas
const Toast = ({
  message = 'Haz reclamado tu código de descuento, nuestros asesores se comunicarán pronto contigo',
  type = 'success',
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success'
    ? 'bg-green-500'
    : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${bgColor} animate-fadeIn`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};



export default function RegisterForm() {


  const [redeemed, setRedeemed] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);
  const [texto, setTexto] = useState('$850.000');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Función para mostrar alertas
  const showAlert = (message = '', type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const cambiarTexto = () => {
    //if (redeemed) return; evita race conditions y múltiples showAlert por múltiples clicks rápidos.
    if (redeemed) return;
    setRedeemed(true);
    setTexto('425.000$');
    showAlert('¡Voucher canjeado! Nuestros asesores se comunicarán contigo.', 'success');
    // Animación breve del precio : clase que dura 700ms
    setAnimatePrice(true);
    setTimeout(() => setAnimatePrice(false), 700);
  };

  const {
    formData,
    handleChange,
    codigoDescuento,
    expiracionCodigo,
    loading,
    mensaje,
    mostrarCard,
    setMostrarCard,
    resetForm,
    handleSubmit
  } = useRegister("");


  useEffect(() => {
    const onKeyDown = (e) => {
      //onKeyDown es una función local que recibirá el evento del teclado. e es el objeto del evento
      if (e.key === 'Escape' && mostrarCard) {
        //e.key === 'Escape' comprueba si la tecla pulsada es la tecla Escape. (Valor estándar de KeyboardEvent.key.)
        //&& mostrarCard evita ejecutar handleCloseCard() cuando la tarjeta ya está cerrada. Es una micro-optimización para no llamar innecesariamente la función.
        handleCloseCard();
      }

    }
      ;
    document.addEventListener('keydown', onKeyDown);
    //Añade el listener global al document para escuchar cualquier tecla que se presione mientras la página esté activa.
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mostrarCard]
    //useEffect es un hook de React que ejecuta la función que le pases después de que el componente se renderiza (o cuando cambian las dependencias).
    // La dependencia es el array final [mostrarCard]. Esto significa: ejecuta el efecto la primera vez (mount) y cada vez que mostrarCard cambie. También ejecutará la función de limpieza antes de ejecutar el efecto de nuevo o cuando el componente se desmonte.
  );

  // Estado para errores específicos por campo
  const [fieldErrors, setFieldErrors] = useState({
    nombreUsuario: "",
    numeroTelefono: "",
    sectorIndustrial: "",
    cargoUsuario: "",
    correoUsuario: "",
    lugarUsuario: "",
    nombreEmpresa: ""
  });

  // Función para limpiar el formulario
  const handleClearForm = () => {
    resetForm();
    setFieldErrors({
      nombreUsuario: "",
      numeroTelefono: "",
      sectorIndustrial: "",
      cargoUsuario: "",
      correoUsuario: "",
      lugarUsuario: "",
      nombreEmpresa: ""
    });
    showAlert('Formulario limpiado correctamente', 'success');
  };

  // Función para cerrar la tarjeta y limpiar el formulario
  const handleCloseCard = () => {
    setMostrarCard(false);
    handleClearForm(); // Limpia el formulario al cerrar la tarjeta
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'nombreUsuario':
        if (!value.trim()) error = 'Debe ingresar el nombre de usuario'
        else if (value.length < 3) error = 'Minimo 3 caracteres'
        break;
      case 'numeroTelefono':
        if (value && value.trim()) {
          if (value.length < 9) error = 'Minimo 9 caracteres'
          else if (!/^\d+$/.test(value)) {
            error = "Solo se permiten numeros"
          }
        }
        break;
      case 'sectorIndustrial':
        if (!value.trim()) error = 'Debe ingresar el sector al que pertenece la empresa'
        else if (value.length < 3) error = 'Minimo 3 caracteres'
        break;
      case 'cargoUsuario':
        if (!value.trim()) error = 'Debe especificar su cargo';
        break;
      case 'correoUsuario':
        if (!value.trim()) error = 'Debe ingresar el correo que le pertenece'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Formato de correo invalido';
        break
      case 'lugarUsuario':
        if (!value.trim()) error = 'Debe ingresar su lugar de asentamiento'
        else if (value.length < 3) error = 'Minimo tres caracteres'
        break;
      case 'nombreEmpresa':
        if (!value.trim()) error = 'Debe ingresar el nombre de la empresa'
        else if (value.length < 3) error = 'Minimo 3 caracteres'
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  // Handler para cambio y validacion
  const handleFielfChange = (field, value) => {
    handleChange(field, value);
    validateField(field, value);
  };

  // Validar todo el formulario antes de enviar
  const validateForm = () => {
    let isValid = true;
    for (const field in formData) {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    }
    return isValid;
  };

  // Handler de envio con validacion completa
  const handleSubmitWithValidation = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    try {
      await handleSubmit(e);
      showAlert(); // Muestra el mensaje por defecto
    } catch (error) {
      showAlert('Error al enviar el formulario', 'error');
    }
  };

  const inputStyle = useMemo(() => ({
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: 'black',
    outline: 'none',
    boxShadow: 'none',
    transition: 'all 0.2s ease',
    appearance: 'none'
  }), []);

  const errorStyle = {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginTop: '4px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 500,
    color: 'white',
    position: 'relative'
  };

  return (
    <>
      <div className="
            maxWidth: 1000px,
            width: '100%',
            margin: 'auto',
            padding: '30px',
            backgroundColor: '#000000ff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(4, 4, 226, 0.3), 0 6px 6px rgba(0, 0, 0, 0.23)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'"

        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <form onSubmit={handleSubmitWithValidation} className="p-8 rounded-xl border border-[#00000] bg-gradient-to-br from-[#0a7bd4] to-[#092a49] rounded-xl shadow-xl ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Nombre de la empresa */}
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Nombre del usuario
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: Galileo Galilei.</span>
              </label>
              <input
                //En React controlar el valor con value enlazado al estado garantiza que la UI refleje siempre el estado (formData). resetForm() debe cambiar formData a valores vacíos y los inputs mostrarán esos valores vacíos.
                value={formData.nombreUsuario}
                type="text"
                onChange={e => handleFielfChange('nombreUsuario', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.nombreEmpresa ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej. Galileo Galilei."
                aria-label="Nombre del usuario" />
              {fieldErrors.nombreUsuario && (
                <p style={errorStyle}>{fieldErrors.nombreUsuario}</p>
              )}

            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Numero de Telefono
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: 3057095134</span>
              </label>
              <input
                value={formData.numeroTelefono}
                type="number"
                onChange={e => handleFielfChange('numeroTelefono', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.numeroTelefono ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }} placeholder="Ej. 3057095134."
                aria-label="Numero de telefono"
              />
              {fieldErrors.numeroTelefono && (
                <p style={errorStyle}>{fieldErrors.numeroTelefono}</p>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Sector industrial
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: Software.</span>
              </label>
              <input
                value={formData.sectorIndustrial}
                type="text"
                onChange={e => handleFielfChange('sectorIndustrial', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.sectorIndustrial ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej. Software"
                aria-label="Sector industrial"

              />
              {fieldErrors.sectorIndustrial && (
                <p style={errorStyle}>{fieldErrors.sectorIndustrial}</p>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Cargo usuario
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: Desarrolador de software.</span>
              </label>
              <input
                value={formData.cargoUsuario}
                type="text"
                onChange={e => handleFielfChange('cargoUsuario', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.cargoUsuario ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej. Desarrolador de software"
                aria-label="Cargo de usuario" />
              {fieldErrors.cargoUsuario && (
                <p style={errorStyle}>{fieldErrors.cargoUsuario}</p>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Correo usuario
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: astronomo@gmail.com</span>
              </label>
              <input
                value={formData.correoUsuario}
                type="text"
                onChange={e => handleFielfChange('correoUsuario', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.correoUsuario ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej. astronomo@gmail.com"
                aria-label="Correo del usuario" />
              {fieldErrors.correoUsuario && (
                <p style={errorStyle}>{fieldErrors.correoUsuario}</p>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Lugar de vivienda
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: Funza, cundinamarca</span>
              </label>
              <input
                value={formData.lugarUsuario}
                type="text"
                onChange={e => handleFielfChange('lugarUsuario', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.lugarUsuario ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej. Funza, Cundinamarca"
                aria-label="lugar de asentamiento" />
              {fieldErrors.lugarUsuario && (
                <p style={errorStyle}>{fieldErrors.lugarUsuario}</p>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}
              className="md:col-span-2">
              <label style={labelStyle}>Nombre empresa
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-white-400 block mt-1">Ej: DATASERVICIOS Y COMUNICACIONES S.A.S.</span>
              </label>
              <input
                value={formData.nombreEmpresa}
                type="text"
                onChange={e => handleFielfChange('nombreEmpresa', e.target.value)}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.nombreEmpresa ? '#ff6b6b' : 'rgba(255,255,255,0.15)'
                }}
                placeholder="Ej.  DATASERVICIOS Y COMUNICACIONES S.A.S."
                aria-label="lugar de empresa" />
              {fieldErrors.nombreEmpresa && (
                <p style={errorStyle}>{fieldErrors.nombreEmpresa}</p>
              )}
            </div>
          </div>
        </form>

      </div>

      {/* Contenedor para los botones */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center md:mt-[2vh]">
        {/* Botón de enviar */}
        <button
          className="
            w-full
            max-w-[400px]
            md:w-[400px]
            mt-[3vh]
            p-[15px]
            bg-[#FF2301]
            text-white
            items-center
            border-none
            rounded-lg
            text-[20px]
            font-semibold
            cursor-pointer
            shadow-[0_4px_15px_rgba(4,4,226,0.3)]
            transition-all
            duration-300
            ease-in-out
            hover:bg-[#ff8243]
            hover:shadow-[0_6px_20px_rgba(4,4,226,0.4)]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          type="submit"
          onClick={handleSubmitWithValidation}
          disabled={loading}
        >
          {loading ? 'Enviando...' : '¡Canjéalo Ahora!'}
        </button>

        {/* Botón para limpiar formulario */}
        <button
          className="
            w-full
            max-w-[400px]
            md:w-[400px]
            mt-[3vh]
            p-[15px]
            bg-gray-500
            text-white
            items-center
            border-none
            rounded-lg
            text-[20px]
            font-semibold
            cursor-pointer
            shadow-[0_4px_15px_rgba(0,0,0,0.3)]
            transition-all
            duration-300
            ease-in-out
            hover:bg-gray-600
            hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]
          "
          type="button"
          onClick={handleClearForm}
        >
          Limpiar Formulario
        </button>
      </div>

      {/* Tarjeta de voucher */}
      {mostrarCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-black/60"
          onClick={handleCloseCard} // Cierra la tarjeta y limpia el formulario
        >
          <div
            className="relative bg-gradient-to-br from-[#0a7bd4] to-[#092a49] text-white rounded-2xl shadow-2xl p-8 w-[420px] max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()} // evita que se cierre al hacer clic dentro
          >
            {/* Botón de cierre */}
            <button
              onClick={handleCloseCard}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition duration-200"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Título */}
            <h2 className="text-3xl font-extrabold text-center tracking-wide mb-1">Voucher Exclusivo</h2>
            <p className="text-lg font-light text-center text-gray-200 mb-6">¡Felicidades por tu registro!</p>

            {/* Porcentaje */}
            <div className="my-2 text-center">
              <span className="text-6xl font-extrabold tracking-tight text-[#ffffff] drop-shadow-lg">50%</span>
              <p className="text-xl font-semibold mt-1 text-gray-200">Descuento aplicado</p>
            </div>

            {/* Código */}
            <div className="w-full mt-6 mb-4">
              <p className="text-center mb-2 text-sm text-gray-100">Tu código es:</p>
              <input
                type="text"
                readOnly
                value={codigoDescuento}
                className="w-full text-center text-lg p-3 border border-white rounded-lg bg-gray-100 text-black font-mono tracking-widest"
              />
            </div>

            {/* Botón y precio */}
            <div className="flex justify-between items-center w-full mt-6">
              <button
                className={`px-5 py-2 text-white font-semibold rounded-lg transition duration-200 w-[135px] h-[50px]
                ${redeemed ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#FF2301] hover:bg-[#ff8243]'}`}
                onClick={cambiarTexto}
                disabled={redeemed}
              >
                {redeemed ? 'Canjeado' : 'Canjear'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-200">Precio final:</p>
                <p className={`text-xl font-bold text-white transition-transform duration-300 ${animatePrice ? 'transform scale-105' : ''}`}>
                  {texto}
                </p>
              </div>
            </div>

            {/* Expiración */}
            <p className="mt-6 text-xs text-center text-gray-300">
              Válido hasta: {new Date(expiracionCodigo).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
      )}

      {/* Toast para alertas */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}