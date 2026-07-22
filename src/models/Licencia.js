import mongoose from 'mongoose';

const licenciaSchema = new mongoose.Schema({
    pc_id: { type: String, unique: true, required: true },
    licencia: { type: String, required: true },
    // Historial de en qué archimonstruos (por id) se ha usado esta licencia,
    // usado para aplicar el límite de "espera 2 minutos entre usos".
    usedFor: [{ id: Number, date: Date }],
    date: { type: Date, default: Date.now },
    // Última vez que se usó esta licencia, para CUALQUIER archimonstruo.
    // Sirve para el cooldown anti-scraping (ver validateLicencia).
    lastUsedAt: { type: Date, default: null },
    // Límite de volumen total por hora (además del cooldown de arriba, que
    // solo mira el tiempo ENTRE consultas). Un scraper que respeta el
    // cooldown pero jamás para igual se nota aquí: ningún jugador real hace
    // decenas de consultas seguidas en una hora.
    usageWindowStart: { type: Date, default: null },
    usageWindowCount: { type: Number, default: 0 },
    // Para no mandar el aviso de Discord una y otra vez mientras siga
    // insistiendo dentro de la misma ventana de una hora.
    usageAlerted: { type: Boolean, default: false },
    // Código propio de esta licencia para el programa de referidos. Si
    // alguien nuevo lo usa al registrarse, esta licencia gana +2 días.
    referralCode: { type: String, unique: true, sparse: true },
    // Si se establece, Mongo borrará este documento automáticamente en
    // cuanto se cumpla esta fecha (índice TTL más abajo). Si es null,
    // la licencia es permanente y nunca se borra sola.
    expiresAt: { type: Date, default: null }
});

// Índice TTL: Mongo revisa periódicamente (aprox. cada 60s) y elimina
// cualquier documento cuyo expiresAt ya haya pasado. Los documentos con
// expiresAt en null son ignorados por este índice, así que las licencias
// permanentes no se ven afectadas.
licenciaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Licencia = mongoose.model('Licencia', licenciaSchema);
