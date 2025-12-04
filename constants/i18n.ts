// Bilingual support utilities (English/French)
// Simple implementation for UI content

export type Language = 'en' | 'fr';

export interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

// Common translations
export const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.pets': { en: 'Pets', fr: 'Animaux' },
  'nav.appointments': { en: 'Appointments', fr: 'Rendez-vous' },
  'nav.services': { en: 'Services', fr: 'Services' },
  'nav.chat': { en: 'AI Chat', fr: 'Chat IA' },
  
  // Common actions
  'action.save': { en: 'Save', fr: 'Enregistrer' },
  'action.cancel': { en: 'Cancel', fr: 'Annuler' },
  'action.delete': { en: 'Delete', fr: 'Supprimer' },
  'action.edit': { en: 'Edit', fr: 'Modifier' },
  'action.add': { en: 'Add', fr: 'Ajouter' },
  'action.back': { en: 'Back', fr: 'Retour' },
  'action.next': { en: 'Next', fr: 'Suivant' },
  'action.done': { en: 'Done', fr: 'Terminé' },
  
  // Common labels
  'label.name': { en: 'Name', fr: 'Nom' },
  'label.email': { en: 'Email', fr: 'Email' },
  'label.phone': { en: 'Phone', fr: 'Téléphone' },
  'label.date': { en: 'Date', fr: 'Date' },
  'label.time': { en: 'Time', fr: 'Heure' },
  
  // Pet related
  'pet.name': { en: 'Pet Name', fr: 'Nom de l\'animal' },
  'pet.breed': { en: 'Breed', fr: 'Race' },
  'pet.species': { en: 'Species', fr: 'Espèce' },
  'pet.gender': { en: 'Gender', fr: 'Genre' },
  'pet.age': { en: 'Age', fr: 'Âge' },
  'pet.allergies': { en: 'Allergies', fr: 'Allergies' },
  'pet.notes': { en: 'Notes', fr: 'Notes' },
  
  // Appointments
  'appointment.book': { en: 'Book Appointment', fr: 'Réserver un rendez-vous' },
  'appointment.upcoming': { en: 'Upcoming Appointments', fr: 'Rendez-vous à venir' },
  'appointment.past': { en: 'Past Appointments', fr: 'Rendez-vous passés' },
  'appointment.status.pending': { en: 'Pending', fr: 'En attente' },
  'appointment.status.confirmed': { en: 'Confirmed', fr: 'Confirmé' },
  'appointment.status.accepted': { en: 'Accepted', fr: 'Accepté' },
  'appointment.status.rejected': { en: 'Rejected', fr: 'Rejeté' },
  'appointment.status.rescheduled': { en: 'Rescheduled', fr: 'Reprogrammé' },
  
  // Vaccinations
  'vaccination.records': { en: 'Vaccination Records', fr: 'Carnet de vaccination' },
  'vaccination.upcoming': { en: 'Upcoming Vaccinations', fr: 'Vaccinations à venir' },
  'vaccination.completed': { en: 'Completed', fr: 'Terminé' },
  'vaccination.due': { en: 'Due', fr: 'Dû' },
  
  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.language': { en: 'Language', fr: 'Langue' },
  'settings.notifications': { en: 'Notifications', fr: 'Notifications' },
  'settings.profile': { en: 'Profile', fr: 'Profil' },
  
  // Notifications
  'notifications.title': { en: 'Notifications', fr: 'Notifications' },
  'notifications.push': { en: 'Push Notifications', fr: 'Notifications push' },
  'notifications.vaccine': { en: 'Vaccine Reminders', fr: 'Rappels de vaccination' },
  'notifications.appointment': { en: 'Appointment Reminders', fr: 'Rappels de rendez-vous' },
  'notifications.medication': { en: 'Medication Reminders', fr: 'Rappels de médicaments' },
};

// Simple translation function
export function t(key: string, language: Language = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[language];
}

// Language context provider would be implemented in a real app
// For now, this is a simple utility that can be used with a language state


