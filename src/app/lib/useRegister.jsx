import { use, useCallback, useState } from 'react'


export default function useRegister() {
  //  Cada campo de la entidad Spring necesita su propio estado:
  // Gestión centralizada del estado del formulario
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    numeroTelefono: "",
    sectorIndustrial: "",
    cargoUsuario: "",
    correoUsuario: "",
    lugarUsuario: "",
    nombreEmpresa: "",
    codigoDescuento: "",
    expiracionDescuento: ""
  })

  const [mensaje, setMensaje] = useState("");
  const [mostrarCard, setMostrarCard] = useState("")
  const [loading, setLoading] = useState("")
  // Estados para la respuesta del servidor
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [expiracionCodigo, setExpiracionCodigo] = useState("")

  // Handler optimizado con useCallback
  //Memoiza funciones para evitar recrearlas en cada render.
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev, // Crea una copia superficial del objeto actual
      [field]: value //Actualiza SOLO la propiedad especificada, Recibe el nombre del campo y su nuevo valor  
    }));
  }, []);
  //Si field = "nombreUsuario", equivale a nombreEmpresa: value
  const resetForm = useCallback(() => {
    setFormData({
      nombreUsuario: "",
      numeroTelefono: "",
      sectorIndustrial: "",
      cargoUsuario: "",
      correoUsuario: "",
      lugarUsuario: "",
      nombreEmpresa: "",
      codigoDescuento: "",
      expiracionDescuento: ""
    })
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMensaje("");
    // Prepara los datos (elimina espacios en blanco)

    const payload = {
      ...formData,
      nombreUsuario: formData.nombreUsuario.trim(),
      numeroTelefono: formData.numeroTelefono.trim(),
      sectorIndustrial: formData.sectorIndustrial.trim(),
      cargoUsuario: formData.cargoUsuario.trim(),
      correoUsuario: formData.correoUsuario.trim(),
      lugarUsuario: formData.lugarUsuario.trim(),
      nombreEmpresa: formData.nombreEmpresa.trim()
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL no está configurada");


      // AbortController para manejar timeout
      //Qué hace: Cancela la petición si demora más de 10 segundos.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      // Envía al backend

      const res = await fetch(`${baseUrl}/api/usuario/public/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);

      }


      const data = await res.json();

      const now = Date.now().toString();
      // Guardar código y expiración
      // Procesa la respuesta

      setCodigoDescuento(data.codigoDescuento ?? "");
      setExpiracionCodigo(data.expiracionCodigo ?? "");
      setMostrarCard(true);// ¡Muestra el modal con el código!

      //Guarda codigo de descuento
      // Correcto: Pasar dos argumentos (clave, valor)
      localStorage.setItem('codigoDescuento', data.codigoDescuento ?? "");
      localStorage.setItem(
        'expiracionCodigo',
        new Date(data.expiracionCodigo).toISOString()

      );
      setMostrarCard(true);
      setMensaje('Registro exitoso, patron')
    } catch (error) {
      console.error("Error registrando usuario: ", error);
      setMensaje(error.name === "AbortError")
        ? "Tiempo de espera agotado, intente nuevamente"
        : error.mensaje || "Error inesperado en el registro"
    } finally {
      setLoading(false);
    }
  }, [formData, loading])

  return {
    formData,
    handleChange,
    mensaje,
    mostrarCard,
    setMostrarCard,
    loading,
    handleSubmit,
    resetForm,
    codigoDescuento,
    expiracionCodigo

  };
}