// Internationalization support
const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    
    // Dashboard
    dashboard: 'Dashboard',
    schedule: 'Schedule',
    notifications: 'Notifications',
    bookings: 'Bookings',
    profile: 'Profile',
    clubs: 'Clubs',
    holidays: 'Holidays',
    
    // Location
    location: 'Location',
    checkIn: 'Check In',
    nearCampus: 'Near Campus',
    farFromCampus: 'Far from Campus',
    distance: 'Distance',
    
    // Admin
    admin: 'Admin',
    analytics: 'Analytics',
    users: 'Users',
    reports: 'Reports',
    
    // Mentor
    mentor: 'Mentor',
    mentees: 'Mentees',
    assignments: 'Assignments',
    sessions: 'Sessions',
    
    // Student
    student: 'Student',
    myBookings: 'My Bookings',
    myClubs: 'My Clubs',
    requestHoliday: 'Request Holiday'
  },
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    submit: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    loading: 'Cargando...',
    dashboard: 'Panel',
    schedule: 'Horario',
    notifications: 'Notificaciones',
    bookings: 'Reservas',
    profile: 'Perfil',
    clubs: 'Clubes',
    holidays: 'Vacaciones',
    location: 'Ubicación',
    checkIn: 'Registrarse',
    nearCampus: 'Cerca del Campus',
    farFromCampus: 'Lejos del Campus',
    distance: 'Distancia',
    admin: 'Administrador',
    analytics: 'Análisis',
    users: 'Usuarios',
    reports: 'Informes',
    mentor: 'Mentor',
    mentees: 'Mentees',
    assignments: 'Tareas',
    sessions: 'Sesiones',
    student: 'Estudiante',
    myBookings: 'Mis Reservas',
    myClubs: 'Mis Clubes',
    requestHoliday: 'Solicitar Vacaciones'
  },
  hi: {
    welcome: 'स्वागत',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    register: 'पंजीकरण',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
    dashboard: 'डैशबोर्ड',
    schedule: 'अनुसूची',
    notifications: 'सूचनाएं',
    bookings: 'बुकिंग',
    profile: 'प्रोफ़ाइल',
    clubs: 'क्लब',
    holidays: 'छुट्टियां',
    location: 'स्थान',
    checkIn: 'चेक इन',
    nearCampus: 'कैंपस के पास',
    farFromCampus: 'कैंपस से दूर',
    distance: 'दूरी',
    admin: 'व्यवस्थापक',
    analytics: 'विश्लेषण',
    users: 'उपयोगकर्ता',
    reports: 'रिपोर्ट',
    mentor: 'मेंटर',
    mentees: 'मेंटी',
    assignments: 'असाइनमेंट',
    sessions: 'सत्र',
    student: 'छात्र',
    myBookings: 'मेरी बुकिंग',
    myClubs: 'मेरे क्लब',
    requestHoliday: 'छुट्टी का अनुरोध'
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event('languagechange'));
  }
};

export const getLanguage = () => currentLanguage;

export const t = (key) => {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
};

export { translations };
export default { setLanguage, getLanguage, t, translations };

