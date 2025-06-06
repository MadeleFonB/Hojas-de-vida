//const apiUrl = 'http://localhost:3000/api/hojas';
const API_AUTH_URL = 'https://hojas-de-vida.onrender.com/api/auth/login';


const listaHojas = document.getElementById('listaHojas');
const formHoja = document.getElementById('formHoja');
const hojaId = document.getElementById('hojaId');

// Filtros
const filterPerfil = document.getElementById('filterPerfil');
const filterHabilidad = document.getElementById('filterHabilidad');
const btnFiltrar = document.getElementById('btnFiltrar');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

// Botones del formulario
const btnCancelar = document.getElementById('btnCancelar');

// ======================== FUNCIONES PRINCIPALES ============================

// Cargar hojas de vida (con filtros opcionales)
async function cargarHojas() {
  let url = API_AUTH_URL;
  const perfil = filterPerfil.value.trim();
  const habilidad = filterHabilidad.value.trim();

  const params = [];
  if (perfil) params.push(`perfil=${encodeURIComponent(perfil)}`);
  if (habilidad) params.push(`habilidad=${encodeURIComponent(habilidad)}`);
  if (params.length > 0) {
    url += '?' + params.join('&');
  }

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Error al cargar hojas');
      if (res.status === 401) {
        alert('Por favor inicia sesión');
      }
      return;
    }

    mostrarHojas(data);
  } catch (err) {
    alert('Error de conexión al cargar hojas');
    console.error(err);
  }
}

// Mostrar hojas de vida en pantalla
function mostrarHojas(hojas) {
  listaHojas.innerHTML = '';
  if (hojas.length === 0) {
    listaHojas.innerHTML = '<p>No se encontraron hojas de vida.</p>';
    return;
  }

  hojas.forEach(h => {
    const div = document.createElement('div');
    div.className = 'hoja';

    div.innerHTML = `
      <strong>${h.nombre}</strong> (${h.perfil_profesional || 'Sin perfil'})<br/>
      Correo: ${h.correo}<br/>
      Teléfono: ${h.telefono}<br/>
      Habilidades: ${h.habilidades.join(', ')}<br/>
      Experiencia: ${h.experiencia}<br/>
      Educación: ${h.educacion}<br/>
      <button data-id="${h.id}" class="btnEditar">Editar</button>
      <button data-id="${h.id}" class="btnEliminar">Eliminar</button>
    `;

    listaHojas.appendChild(div);
  });

  document.querySelectorAll('.btnEditar').forEach(btn => {
    btn.onclick = () => editarHoja(btn.getAttribute('data-id'));
  });
  document.querySelectorAll('.btnEliminar').forEach(btn => {
    btn.onclick = () => eliminarHoja(btn.getAttribute('data-id'));
  });
}

// ===================== CRUD: Editar, Eliminar, Guardar =======================

// Cargar hoja de vida en el formulario para edición
async function editarHoja(id) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_AUTH_URL}/${id}`, { headers });
  if (!res.ok) {
    alert('No se encontró la hoja de vida');
    return;
  }

  const hoja = await res.json();

  hojaId.value = hoja.id;
  formHoja.nombre.value = hoja.nombre;
  formHoja.correo.value = hoja.correo;
  formHoja.telefono.value = hoja.telefono;
  formHoja.perfilProfesional.value = hoja.perfil_profesional || '';
  formHoja.habilidades.value = hoja.habilidades.join(', ');
  formHoja.experiencia.value = hoja.experiencia;
  formHoja.educacion.value = hoja.educacion;
}

// Eliminar hoja de vida
async function eliminarHoja(id) {
  if (!confirm('¿Estás seguro de eliminar esta hoja de vida?')) return;

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_AUTH_URL}/${id}`, { method: 'DELETE', headers });
  if (res.ok) {
    alert('Hoja eliminada');
    cargarHojas();
  } else {
    alert('Error al eliminar');
  }
}

// Guardar hoja (crear o actualizar)
formHoja.onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    nombre: formHoja.nombre.value,
    correo: formHoja.correo.value,
    telefono: formHoja.telefono.value,
    perfil_profesional: formHoja.perfilProfesional.value,
    habilidades: formHoja.habilidades.value.split(',').map(h => h.trim()).filter(h => h),
    experiencia: formHoja.experiencia.value,
    educacion: formHoja.educacion.value,
  };

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    let res;
    if (hojaId.value) {
      // Actualizar
      res = await fetch(`${API_AUTH_URL}/${hojaId.value}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    } else {
      // Crear
      res = await fetch(API_AUTH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }

    if (res.ok) {
      alert('Hoja guardada con éxito');
      hojaId.value = '';
      formHoja.reset();
      cargarHojas();
    } else {
      alert('Error guardando hoja');
    }
  } catch (err) {
    alert('Error de conexión');
    console.error(err);
  }
};

// ========================= AUTENTICACIÓN =========================

async function login(correo, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Error en login');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    alert('Login exitoso!');
    verificarAutenticacion();
    cargarHojas();
  } catch (error) {
    console.error('Error en login:', error);
    alert('Error al intentar iniciar sesión');
  }
}

function logout() {
  localStorage.removeItem('token');
  alert('Sesión cerrada correctamente');
  location.reload();
}

// ========================= EVENTOS ==============================

// Cancelar edición
btnCancelar.onclick = () => {
  hojaId.value = '';
  formHoja.reset();
};

// Filtros
btnFiltrar.onclick = () => cargarHojas();
btnLimpiarFiltros.onclick = () => {
  filterPerfil.value = '';
  filterHabilidad.value = '';
  cargarHojas();
};

// Mostrar/ocultar secciones según autenticación
function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  const seccionesProtegidas = [
    formHoja.parentElement,
    listaHojas.parentElement,
    document.querySelector('section h2 + label')?.parentElement // filtros
  ];

  if (token) {
    document.getElementById('loginSection')?.style?.setProperty('display', 'none');
    document.getElementById('btnLogout')?.style?.setProperty('display', 'inline-block');
    seccionesProtegidas.forEach(sec => {
      if (sec) sec.style.display = 'block';
    });
  } else {
    document.getElementById('loginSection')?.style?.setProperty('display', 'block');
    document.getElementById('btnLogout')?.style?.setProperty('display', 'none');
    seccionesProtegidas.forEach(sec => {
      if (sec) sec.style.display = 'none';
    });
  }
}

// Asociar evento al botón logout
document.getElementById('btnLogout')?.addEventListener('click', logout);

// Ejecutar al cargar la página
window.onload = () => {
  verificarAutenticacion();
  cargarHojas();
};
