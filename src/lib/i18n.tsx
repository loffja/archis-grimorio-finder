import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "es" | "fr" | "en";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

const STORAGE_KEY = "bnotifier-lang";

type Dict = Record<string, string>;

const es: Dict = {
  adminPanelLabel: "Admin panel",
  restrictedAccessTitle: "Acceso restringido",
  adminKeyLabel: "Clave de administrador",
  invalidKeyError: "Clave incorrecta.",
  enterButton: "Entrar →",

  licensesTitle: "Licencias",
  totalLabel: "Total",
  usesLabel: "Usos",
  logoutButton: "Cerrar sesión",

  killswitchTitle: "⚠ Interruptor de emergencia",
  killswitchDesc: "Desactiva estas funciones al instante para todo el mundo, sin tocar código.",
  redeemCodesLabel: "Canjear códigos",
  revealPositionsLabel: "Revelar posiciones",
  activeLabel: "Activo",
  disabledLabel: "Desactivado",

  registeredLicensesTitle: "Licencias registradas",
  searchPlaceholder: "Buscar por PC ID o licencia…",
  searchAriaLabel: "Buscar licencias",
  reloadButton: "↻ Recargar",
  loadingLabel: "Cargando…",
  noLicensesLabel: "Sin licencias.",
  noMatchLabel: 'Ninguna licencia coincide con "{query}".',
  licensesListCaption: "Lista de licencias registradas",
  colPcId: "PC ID",
  colLicense: "Licencia",
  colUses: "Usos",
  colCreated: "Creación",
  colExpires: "Caduca",
  permanentLabel: "Permanente",
  extendButton: "Extender",
  deleteButton: "Eliminar",
  addLabel: "Añadir",
  unitLabel: "Unidad",
  unitMinutes: "Minutos",
  unitHours: "Horas",
  unitDays: "Días",
  unitWeeks: "Semanas",
  unitMonths: "Meses",
  confirmButton: "Confirmar →",
  cancelButton: "Cancelar",

  registerLicenseTitle: "Registrar nueva licencia",
  newLicenseLabel: "Nueva licencia",
  generateButton: "Generar",
  durationOptionalLabel: "Duración (opcional)",
  durationUnitAria: "Unidad de duración",
  egHours: "Ej. 24",
  emptyMeansPermanent: "Vacío = licencia permanente",
  referralCodeLabel: "Código de referido (opcional)",
  referralHelp: "Si te dijo quién lo invitó, ponlo aquí — le suma +1 día a esa licencia.",
  registerButton: "Registrar →",

  activeArchisTitle: "Archimonstruos activos",
  liveLabel: "En vivo",
  connectingLabel: "Conectando…",
  noActiveArchis: "No hay archimonstruos activos ahora mismo.",

  promoCodesTitle: "Códigos promocionales",
  noCodesYet: "Sin códigos todavía.",
  promoListCaption: "Lista de códigos promocionales",
  colCode: "Código",
  colDuration: "Duración",
  colStatus: "Estado",
  exhaustedLabel: "Agotado",
  createNewCodeTitle: "Crear código nuevo",
  codeLabel: "Código",
  maxUsesLabel: "Usos máximos",
  promoDurationLabel: "Duración de la licencia (opcional — vacío = permanente)",
  egSeven: "Ej. 7",
  promoDurationUnitAria: "Unidad de duración del código",
  createCodeButton: "Crear código →",

  auditLogTitle: "Registro de actividad",
  noActivityYet: "Sin actividad todavía.",

  administratorsTitle: "Administradores",
  onlyYouHaveAccess: "Solo tú (con la clave maestra) tienes acceso por ahora.",
  adminsListCaption: "Lista de administradores adicionales",
  colName: "Nombre",
  revokeButton: "Revocar",
  addAdminTitle: "Añadir administrador",
  keyGeneratedWarning: "Clave generada — cópiala ahora, no se volverá a mostrar",
  egAlex: "Ej. Alex",
  createButton: "Crear →",

  confirmRevokeAdmin: "¿Revocar el acceso de este administrador?",
  confirmDeleteCode: '¿Eliminar el código "{code}"?',
  confirmDeleteLicense: '¿Eliminar la licencia "{license}"? Esta acción no se puede deshacer.',

  couldNotLoadList: "No se pudo cargar la lista.",
  couldNotLoadAuditLog: "No se pudo cargar el registro.",
  licenseRegisteredOk: "Licencia registrada correctamente.",
  couldNotContactServer: "No se pudo contactar con el servidor.",
  licenseDeletedOk: "Licencia eliminada.",
  licenseExtendedOk: "Licencia extendida.",
  codeCreatedOk: "Código creado.",
  codeDeletedOk: "Código eliminado.",

  action_licencia_creada: "Licencia creada",
  action_licencia_eliminada: "Licencia eliminada",
  action_licencia_extendida: "Licencia extendida",
  action_codigo_creado: "Código promocional creado",
  action_codigo_eliminado: "Código promocional eliminado",
  action_ajustes_actualizados: "Interruptor cambiado",
  action_admin_creado: "Administrador añadido",
  action_admin_revocado: "Administrador revocado",
  action_referido_recompensado: "Referido premiado (+1 día)",

  languageSelectorLabel: "Cambiar idioma",
};

const fr: Dict = {
  adminPanelLabel: "Panneau admin",
  restrictedAccessTitle: "Accès restreint",
  adminKeyLabel: "Clé administrateur",
  invalidKeyError: "Clé incorrecte.",
  enterButton: "Entrer →",

  licensesTitle: "Licences",
  totalLabel: "Total",
  usesLabel: "Utilisations",
  logoutButton: "Se déconnecter",

  killswitchTitle: "⚠ Interrupteur d'urgence",
  killswitchDesc: "Désactivez ces fonctions instantanément pour tout le monde, sans toucher au code.",
  redeemCodesLabel: "Échanger des codes",
  revealPositionsLabel: "Révéler les positions",
  activeLabel: "Actif",
  disabledLabel: "Désactivé",

  registeredLicensesTitle: "Licences enregistrées",
  searchPlaceholder: "Rechercher par PC ID ou licence…",
  searchAriaLabel: "Rechercher des licences",
  reloadButton: "↻ Recharger",
  loadingLabel: "Chargement…",
  noLicensesLabel: "Aucune licence.",
  noMatchLabel: 'Aucune licence ne correspond à "{query}".',
  licensesListCaption: "Liste des licences enregistrées",
  colPcId: "PC ID",
  colLicense: "Licence",
  colUses: "Utilisations",
  colCreated: "Créée",
  colExpires: "Expire",
  permanentLabel: "Permanente",
  extendButton: "Prolonger",
  deleteButton: "Supprimer",
  addLabel: "Ajouter",
  unitLabel: "Unité",
  unitMinutes: "Minutes",
  unitHours: "Heures",
  unitDays: "Jours",
  unitWeeks: "Semaines",
  unitMonths: "Mois",
  confirmButton: "Confirmer →",
  cancelButton: "Annuler",

  registerLicenseTitle: "Enregistrer une nouvelle licence",
  newLicenseLabel: "Nouvelle licence",
  generateButton: "Générer",
  durationOptionalLabel: "Durée (optionnelle)",
  durationUnitAria: "Unité de durée",
  egHours: "Ex. 24",
  emptyMeansPermanent: "Vide = licence permanente",
  referralCodeLabel: "Code de parrainage (optionnel)",
  referralHelp: "S'il vous a dit qui l'a invité, indiquez-le ici — cela ajoute +1 jour à cette licence.",
  registerButton: "Enregistrer →",

  activeArchisTitle: "Archimonstres actifs",
  liveLabel: "En direct",
  connectingLabel: "Connexion…",
  noActiveArchis: "Aucun archimonstre actif pour le moment.",

  promoCodesTitle: "Codes promotionnels",
  noCodesYet: "Aucun code pour l'instant.",
  promoListCaption: "Liste des codes promotionnels",
  colCode: "Code",
  colDuration: "Durée",
  colStatus: "Statut",
  exhaustedLabel: "Épuisé",
  createNewCodeTitle: "Créer un nouveau code",
  codeLabel: "Code",
  maxUsesLabel: "Utilisations maximales",
  promoDurationLabel: "Durée de la licence (optionnelle — vide = permanente)",
  egSeven: "Ex. 7",
  promoDurationUnitAria: "Unité de durée du code",
  createCodeButton: "Créer le code →",

  auditLogTitle: "Journal d'activité",
  noActivityYet: "Aucune activité pour le moment.",

  administratorsTitle: "Administrateurs",
  onlyYouHaveAccess: "Seul vous (avec la clé principale) avez accès pour le moment.",
  adminsListCaption: "Liste des administrateurs supplémentaires",
  colName: "Nom",
  revokeButton: "Révoquer",
  addAdminTitle: "Ajouter un administrateur",
  keyGeneratedWarning: "Clé générée — copiez-la maintenant, elle ne sera plus affichée",
  egAlex: "Ex. Alex",
  createButton: "Créer →",

  confirmRevokeAdmin: "Révoquer l'accès de cet administrateur ?",
  confirmDeleteCode: 'Supprimer le code "{code}" ?',
  confirmDeleteLicense: 'Supprimer la licence "{license}" ? Cette action est irréversible.',

  couldNotLoadList: "Impossible de charger la liste.",
  couldNotLoadAuditLog: "Impossible de charger le journal.",
  licenseRegisteredOk: "Licence enregistrée avec succès.",
  couldNotContactServer: "Impossible de contacter le serveur.",
  licenseDeletedOk: "Licence supprimée.",
  licenseExtendedOk: "Licence prolongée.",
  codeCreatedOk: "Code créé.",
  codeDeletedOk: "Code supprimé.",

  action_licencia_creada: "Licence créée",
  action_licencia_eliminada: "Licence supprimée",
  action_licencia_extendida: "Licence prolongée",
  action_codigo_creado: "Code promotionnel créé",
  action_codigo_eliminado: "Code promotionnel supprimé",
  action_ajustes_actualizados: "Interrupteur modifié",
  action_admin_creado: "Administrateur ajouté",
  action_admin_revocado: "Administrateur révoqué",
  action_referido_recompensado: "Parrainage récompensé (+1 jour)",

  languageSelectorLabel: "Changer de langue",
};

const en: Dict = {
  adminPanelLabel: "Admin panel",
  restrictedAccessTitle: "Restricted access",
  adminKeyLabel: "Administrator key",
  invalidKeyError: "Incorrect key.",
  enterButton: "Enter →",

  licensesTitle: "Licenses",
  totalLabel: "Total",
  usesLabel: "Uses",
  logoutButton: "Log out",

  killswitchTitle: "⚠ Emergency killswitch",
  killswitchDesc: "Instantly disable these features for everyone, without touching code.",
  redeemCodesLabel: "Redeem codes",
  revealPositionsLabel: "Reveal positions",
  activeLabel: "Active",
  disabledLabel: "Disabled",

  registeredLicensesTitle: "Registered licenses",
  searchPlaceholder: "Search by PC ID or license…",
  searchAriaLabel: "Search licenses",
  reloadButton: "↻ Reload",
  loadingLabel: "Loading…",
  noLicensesLabel: "No licenses.",
  noMatchLabel: 'No license matches "{query}".',
  licensesListCaption: "List of registered licenses",
  colPcId: "PC ID",
  colLicense: "License",
  colUses: "Uses",
  colCreated: "Created",
  colExpires: "Expires",
  permanentLabel: "Permanent",
  extendButton: "Extend",
  deleteButton: "Delete",
  addLabel: "Add",
  unitLabel: "Unit",
  unitMinutes: "Minutes",
  unitHours: "Hours",
  unitDays: "Days",
  unitWeeks: "Weeks",
  unitMonths: "Months",
  confirmButton: "Confirm →",
  cancelButton: "Cancel",

  registerLicenseTitle: "Register new license",
  newLicenseLabel: "New license",
  generateButton: "Generate",
  durationOptionalLabel: "Duration (optional)",
  durationUnitAria: "Duration unit",
  egHours: "E.g. 24",
  emptyMeansPermanent: "Empty = permanent license",
  referralCodeLabel: "Referral code (optional)",
  referralHelp: "If they told you who invited them, put it here — it adds +1 day to that license.",
  registerButton: "Register →",

  activeArchisTitle: "Active archmonsters",
  liveLabel: "Live",
  connectingLabel: "Connecting…",
  noActiveArchis: "No active archmonsters right now.",

  promoCodesTitle: "Promo codes",
  noCodesYet: "No codes yet.",
  promoListCaption: "List of promo codes",
  colCode: "Code",
  colDuration: "Duration",
  colStatus: "Status",
  exhaustedLabel: "Exhausted",
  createNewCodeTitle: "Create new code",
  codeLabel: "Code",
  maxUsesLabel: "Max uses",
  promoDurationLabel: "License duration (optional — empty = permanent)",
  egSeven: "E.g. 7",
  promoDurationUnitAria: "Code duration unit",
  createCodeButton: "Create code →",

  auditLogTitle: "Activity log",
  noActivityYet: "No activity yet.",

  administratorsTitle: "Administrators",
  onlyYouHaveAccess: "Only you (with the master key) have access for now.",
  adminsListCaption: "List of additional administrators",
  colName: "Name",
  revokeButton: "Revoke",
  addAdminTitle: "Add administrator",
  keyGeneratedWarning: "Key generated — copy it now, it won't be shown again",
  egAlex: "E.g. Alex",
  createButton: "Create →",

  confirmRevokeAdmin: "Revoke this administrator's access?",
  confirmDeleteCode: 'Delete the code "{code}"?',
  confirmDeleteLicense: 'Delete the license "{license}"? This action cannot be undone.',

  couldNotLoadList: "Could not load the list.",
  couldNotLoadAuditLog: "Could not load the log.",
  licenseRegisteredOk: "License registered successfully.",
  couldNotContactServer: "Could not contact the server.",
  licenseDeletedOk: "License deleted.",
  licenseExtendedOk: "License extended.",
  codeCreatedOk: "Code created.",
  codeDeletedOk: "Code deleted.",

  action_licencia_creada: "License created",
  action_licencia_eliminada: "License deleted",
  action_licencia_extendida: "License extended",
  action_codigo_creado: "Promo code created",
  action_codigo_eliminado: "Promo code deleted",
  action_ajustes_actualizados: "Switch changed",
  action_admin_creado: "Administrator added",
  action_admin_revocado: "Administrator revoked",
  action_referido_recompensado: "Referral rewarded (+1 day)",

  languageSelectorLabel: "Change language",
};

const dictionaries: Record<Lang, Dict> = { es, fr, en };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "fr" || stored === "en") return stored;
  return "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[lang] ?? dictionaries.es;
      let str = dict[key] ?? dictionaries.es[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider");
  }
  return ctx;
}
