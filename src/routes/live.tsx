import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";
import { translateArchmonsterName } from "@/lib/archmonster-names";
import { handleMonsterImgError } from "@/lib/monster-image";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "En vivo — DakuBot" },
      {
        name: "description",
        content: "Archimonstruos activos ahora mismo en Dofus Touch.",
      },
    ],
  }),
  component: LivePage,
});

type ArchimonstruoActivo = {
  id: number;
  name: string;
  server: string;
  date: string;
  imageUrl: string;
};

type Stats = {
  archimonstrosHoy: number;
  licenciasActivas: number;
  masBuscado: { id: number; name: string; usos: number } | null;
};

// Espacios visibles en la cuadrícula. Al aparecer uno nuevo y no caber más,
// el más antiguo se cae de la vista (aunque siga activo en la base de datos
// hasta que se cumplan sus 30 minutos reales).
const MAX_VISIBLE = 12;
// Refresco de respaldo, solo por si la conexión en tiempo real se corta y
// tarda en reconectar. Lo normal es que los nuevos lleguen al instante.
const FALLBACK_REFRESH_MS = 120_000;
const STATS_REFRESH_MS = 60_000;

// Se muestra SOLO cuando todavía no hay archimonstruos reales activos (es
// decir, mientras el bot no esté corriendo de verdad). En cuanto llegue el
// primer dato real, este bloque deja de mostrarse solo — no hay que
// desactivarlo a mano.
//
// Pool completo de los 255 archimonstruos reales del juego (mismos nombres
// que usa tu backend). La demo va rotando entre ellos sola, simulando
// apariciones — no son solo 6 fijos.
const DEMO_POOL: { id: number; name: string }[] = [
  { id: 2544, name: "Abrajinieves, el Enanito" },
  { id: 2389, name: "Abrakadabra, el Pata de Kabra" },
  { id: 2388, name: "Abrakeponerse, el Optimista" },
  { id: 2309, name: "Abrakíledo, el Patas Ligeras" },
  { id: 2386, name: "Ábrakin, el Oscuro" },
  { id: 2385, name: "Abrákneo, el Elegido" },
  { id: 2381, name: "Abroesidor, el Navegante" },
  { id: 2384, name: "Abubanero, el Naranja" },
  { id: 2498, name: "Abustin Pawits, el Bocasucia" },
  { id: 2391, name: "Amlobdovar, el Movidista" },
  { id: 2311, name: "Araklas Mausus, el Encofiado" },
  { id: 2393, name: "Araknekros, el Salvaje" },
  { id: 2310, name: "Arakniry, la destripada" },
  { id: 2276, name: "Arib Abá, el de los 40" },
  { id: 2312, name: "Arkandinska, la Lírica" },
  { id: 2314, name: "Bandiras, el zorro del clan Los Malagueños" },
  { id: 2313, name: "Banrí Mantís, el Pigmentado" },
  { id: 2545, name: "Barbrétzel, el Salado" },
  { id: 2417, name: "Barchwork, el Multicolor" },
  { id: 2361, name: "Barrostroporosis, el Frágil" },
  { id: 2400, name: "Biblidiana, la Controvertida" },
  { id: 2401, name: "Biblópera, el Fantasma" },
  { id: 2396, name: "Biblues, el Ritmo" },
  { id: 2399, name: "Bibolsón, el Anilloso" },
  { id: 2403, name: "Blackowwibbit, el Imaginativo" },
  { id: 2402, name: "Black Tegerwoddit, el Swinguero" },
  { id: 2404, name: "Blómperman, el Explosivo" },
  { id: 2405, name: "Blop Dylan, el Ventoso" },
  { id: 2406, name: "Blop Inocho, el Narizotas" },
  { id: 2407, name: "Bloppy Reinarker, la Primera Mitad" },
  { id: 2549, name: "Bo'Callaghan, el Trebol" },
  { id: 2429, name: "Botalak Cabalgator, el Ingenioso" },
  { id: 2416, name: "Bwarkgner, el Magnificentista" },
  { id: 2418, name: "Bwhork Mageneration, el Precursor" },
  { id: 2430, name: "Cabalista el Conspirador" },
  { id: 2420, name: "Caballagami Pueryukazo, el Aburrido" },
  { id: 2431, name: "Saltolante, la Gimnasta" },
  { id: 2327, name: "Cangri-doo, la Hadada" },
  { id: 2419, name: "Cañón Dorzuelo, el Doloroso" },
  { id: 2344, name: "Capioricito Rojo, el Forestal" },
  { id: 2432, name: "Cerduodenitis, el Abdominal" },
  { id: 2320, name: "Chaferditos, los Tres" },
  { id: 2319, name: "Cháferlie, el Ángeles" },
  { id: 2422, name: "Chafernan D'alonzo, el Nano" },
  { id: 2421, name: "Chafíner Divarrio, el Casposo" },
  { id: 2322, name: "Chagüer Langers, los Coloridos" },
  { id: 2373, name: "Chalbis, el King" },
  { id: 2423, name: "Chamadkasas, las Desesperadas" },
  { id: 2553, name: "Champacné, el Granitos" },
  { id: 2426, name: "Champán, el Espumoso" },
  { id: 2323, name: "Champi Casso, el Cúbico" },
  { id: 2552, name: "Champli, el Sonoro" },
  { id: 2425, name: "Champlin, el Cómico" },
  { id: 2424, name: "Champlomo, el Soldadito" },
  { id: 2427, name: "Champolís, el Astronauta" },
  { id: 2321, name: "Charfernegger, el Goberneitor" },
  { id: 2566, name: "Chavala Zotaina, la Castigadora" },
  { id: 2325, name: "Cochumájer, el Rápido" },
  { id: 2439, name: "Cocodranel, la perfumada" },
  { id: 2433, name: "Codembolia, el Obstructor" },
  { id: 2378, name: "Colmillamoto, el Omnipotente" },
  { id: 2440, name: "Colmillazaqui, el Inagotable" },
  { id: 2555, name: "Cortazador, el Inconformista" },
  { id: 2326, name: "Crojmeo, el Veronés" },
  { id: 2436, name: "Crujaitor, el Eurovisivo" },
  { id: 2561, name: "Crujíbaro, el Tzantza" },
  { id: 2438, name: "Crujidilo Dundee, el Australiano" },
  { id: 2556, name: "Crujlieta, la Veronesa" },
  { id: 2559, name: "Crustérix, el Viajante" },
  { id: 2560, name: "Crusthórpal, Passian el Submarino" },
  { id: 2558, name: "Crustodralí, el Bigotudo" },
  { id: 2557, name: "Crustoriyama, el Boludo" },
  { id: 2437, name: "Cuergotismo, el Febril" },
  { id: 2348, name: "Diente de Lennon, el Universal" },
  { id: 2360, name: "Dientetris, el Inolvidable" },
  { id: 2562, name: "Diszápulo Delzoih, el Profeta" },
  { id: 2442, name: "DoK Ok, el Gasterópodo" },
  { id: 2578, name: "Don Kizoth, el Obstinado" },
  { id: 2408, name: "Doomba, el Inimitable" },
  { id: 2465, name: "Dragamenón, el Destructroyer" },
  { id: 2448, name: "Drageagainst, el Máquina" },
  { id: 2450, name: "Dragkuín el Magnífico" },
  { id: 2446, name: "Dragma, el Griego" },
  { id: 2372, name: "Dragmocles, el Fatalista" },
  { id: 2458, name: "Dragore, el Sangriento" },
  { id: 2454, name: "Dragoss&Dungeoss, el Original" },
  { id: 2457, name: "Dragoss Pel, el Negro" },
  { id: 2455, name: "Dragosstinho, el Futboleiro" },
  { id: 2456, name: "Dragoss To, el Caluroso" },
  { id: 2379, name: "Dragozart Almandreus, el Prodigio" },
  { id: 2459, name: "Dragrogui, el Ebrio" },
  { id: 2367, name: "Dragstor, el de la Esquina" },
  { id: 2453, name: "Dragump, el Oscarizado" },
  { id: 2449, name: "Drajoanito, el Rojo" },
  { id: 2451, name: "Drajoimito, el Azul" },
  { id: 2445, name: "Drajorgito, el Verde" },
  { id: 2368, name: "Drakaoly, la Violinista" },
  { id: 2464, name: "Drakójak, el Piruletas" },
  { id: 2462, name: "Drakolakao, el Sabroso" },
  { id: 2447, name: "Draltóniko, el Ojo de Águila" },
  { id: 2377, name: "Dreggeatón, el Latino" },
  { id: 2452, name: "Dreghouse, el Cínico" },
  { id: 2369, name: "Drugmiente, la Bella" },
  { id: 2616, name: "El Strat, el Vampiro" },
  { id: 2524, name: "El Stronyjok, el Pajarillo" },
  { id: 2575, name: "El Strópala Otravez, el Sam" },
  { id: 2615, name: "Escarálibur, la Legendaria" },
  { id: 2280, name: "Escarumais, los Siete" },
  { id: 2282, name: "Escorobeitor, el Malvado" },
  { id: 2283, name: "Esjaraboja Verde, el Mentolado" },
  { id: 2550, name: "Esquenosé, el Indeciso" },
  { id: 2281, name: "Estarausija Azul, el del Danubio" },
  { id: 2563, name: "Fantasma Arepopins, la Niñera" },
  { id: 2466, name: "Fantasmarley, el Rastafari" },
  { id: 2468, name: "Fantastle Vániante, el Matavampiros" },
  { id: 2467, name: "Fanthraks, el Acomplejado" },
  { id: 2565, name: "Florivera, el Muralista" },
  { id: 2272, name: "Gazpischos, el Refrescante" },
  { id: 2358, name: "Gearsol Metalvaje, el Espía" },
  { id: 2376, name: "Gelatina Turner, la Best" },
  { id: 2487, name: "Gelatiris, el Arenero" },
  { id: 2371, name: "Gelazquina, el Men" },
  { id: 2493, name: "Gínsenk, el Estimulante" },
  { id: 2494, name: "Goyablín, el Afrancesado" },
  { id: 2292, name: "Granfortote el Contramaestre" },
  { id: 2497, name: "Guerred-Fish, el Cortés" },
  { id: 2569, name: "Guerreynor Zothia, la Superviviente" },
  { id: 2328, name: "Herranor, el Pizzaiolo" },
  { id: 2353, name: "Jabachlí, el Casto" },
  { id: 2279, name: "Jabulio de la Llanesias, el Portero" },
  { id: 2316, name: "Jalatintanic, el Hundido" },
  { id: 2315, name: "Jalatintin, el Reportero" },
  { id: 2317, name: "Jaleté, el Extraterrestre" },
  { id: 2428, name: "Jefe Cocolumbo, el Detective" },
  { id: 2324, name: "Jefe de Victoria Jarató, el Mancillado" },
  { id: 4461, name: "Kaenekfeu el Parlanchín" },
  { id: 2502, name: "Kanábolo, el Rubio" },
  { id: 2506, name: "Kanibúlrich Lars, el Metálico" },
  { id: 2507, name: "Kanníbal, el Lector" },
  { id: 2503, name: "Kánudalf, el Kanoso" },
  { id: 2570, name: "Kasrafantásol, el Parapsicólogo" },
  { id: 2571, name: "Kidoloroso, del Calmante" },
  { id: 2572, name: "Kílibrill vol.2, el Vengativo" },
  { id: 2508, name: "Kiravel, el Artesano" },
  { id: 2505, name: "Klaidíbola Cerbarrow, la Otra Mitad" },
  { id: 2509, name: "Koalako, el Pato" },
  { id: 2513, name: "Koalalia, el Mudo" },
  { id: 2516, name: "Koalugok, el Pato" },
  { id: 2518, name: "Koaluik, el Pato" },
  { id: 2515, name: "Koalúkyluk, el Solitario" },
  { id: 2514, name: "Koayak, el Destripador" },
  { id: 2519, name: "Koelloks, el Cerealista" },
  { id: 2517, name: "Kokajín, el Calvo" },
  { id: 2573, name: "Kokotel, el Agitado" },
  { id: 2520, name: "Kolafuerte, el Pegatodo" },
  { id: 2301, name: "Kosakhiin, el Lunítico" },
  { id: 2521, name: "Kramelanoma, el Ennegrecedor" },
  { id: 2522, name: "Kwane, el Ciudadano" },
  { id: 2331, name: "Larvangoj, el Desorejado" },
  { id: 2332, name: "Larvémming, el Descerebrado" },
  { id: 2574, name: "Larvichuelas Jack, las Mágicas" },
  { id: 2525, name: "Led Empling, el Ascensorista" },
  { id: 2460, name: "Ledrag, el Ognat" },
  { id: 2363, name: "Lodontólogo, el Sonriente" },
  { id: 2532, name: "Maéstrick Vaggerpiro, el Canto Rodado" },
  { id: 2359, name: "Maestrónomo, el Estrellado" },
  { id: 2531, name: "Maestro Peado, la Cuenta" },
  { id: 2461, name: "Mafaldragosa, la Hermana pequeña" },
  { id: 2528, name: "Mamoon, el Grande" },
  { id: 2529, name: "Mandreinas, las Nueve" },
  { id: 4465, name: "Marude la Enarenada" },
  { id: 2336, name: "Mashkira, la Rubia de Bote" },
  { id: 2484, name: "Mazomorra, el Rolista" },
  { id: 2554, name: "Merkxguerrita, el Ogro" },
  { id: 2333, name: "Mililupin, el Tercero" },
  { id: 2337, name: "Miluigi, el Fontanero" },
  { id: 2335, name: "Minerón, el Incendiario" },
  { id: 2568, name: "Minocontavan Konm'astuzia, el Colorado" },
  { id: 2533, name: "Mitoskorleone, el Buen Padre" },
  { id: 2534, name: "Momíller Frának, el Umbrío" },
  { id: 2577, name: "Mospetero, el Triple" },
  { id: 2580, name: "Munchfavard, el Gritador" },
  { id: 2538, name: "Nakúmbat, el Mortal" },
  { id: 4463, name: "Nanashi el Virtuoso" },
  { id: 2539, name: "Nelgibson, el Letal" },
  { id: 2579, name: "Nieruba, el Poeta" },
  { id: 2540, name: "Nipultay Dea, el Poco Inspirado" },
  { id: 2541, name: "Nozdoku, el Numérico" },
  { id: 2542, name: "Arafernalia, la Calígrafa" },
  { id: 2543, name: "Arakazam, la Psíquica" },
  { id: 4457, name: "Onistérico el Desenfrenado" },
  { id: 2585, name: "Osurce Kodes, el Problemático" },
  { id: 2318, name: "Paelladero Oscuro, el Arrozoso" },
  { id: 2584, name: "Palmifred Passteroh, el Bailarín" },
  { id: 2583, name: "Palmila, la Vigilante" },
  { id: 2581, name: "Palmiró, el Tetradimensional" },
  { id: 2582, name: "Palmiscor Pions, los Amantes" },
  { id: 2397, name: "Pastortilla, el Huevo" },
  { id: 2271, name: "Peketchup, el Hamburguesero" },
  { id: 2293, name: "Pekewasqhabit, el Juguetón" },
  { id: 2294, name: "Pekiwbyt Hambriento, el Glotón" },
  { id: 2343, name: "Pido, el Greñas" },
  { id: 2341, name: "Pioch, el Arenil" },
  { id: 2342, name: "Piokacho, el Eléctrico" },
  { id: 2270, name: "Piralhaka, el Maorí" },
  { id: 2346, name: "Pischili Conkarne, el Fuerte" },
  { id: 2340, name: "Pischistorra, la Cárnica" },
  { id: 2339, name: "Pischto, el Tomatoso" },
  { id: 2338, name: "Pischurrasco, el Braseado" },
  { id: 2383, name: "Pohozí, el Jorobado" },
  { id: 2349, name: "Prestrit, el Luchador" },
  { id: 2486, name: "Pulgargrolito, el Astuto" },
  { id: 2273, name: "Rafa de Alnadalillas, el Canibal" },
  { id: 2334, name: "Ratatouille el cocinero" },
  { id: 2275, name: "Ratila, el Huno" },
  { id: 2350, name: "Ratokio de Alcontel, la Despeinada" },
  { id: 2354, name: "Ratom Raider, la Curvas" },
  { id: 2351, name: "Raúl Cera, la Péptica" },
  { id: 2614, name: "Reyuna, el Dibujante" },
  { id: 2352, name: "Rochavo Democho, el Chispotiado" },
  { id: 2277, name: "Rostetricia, la Reproductiva" },
  { id: 4459, name: "Sakkado la Transportista" },
  { id: 2587, name: "Sargende Michael, el Narrador" },
  { id: 2355, name: "Satofu, el PlasticPaddy" },
  { id: 2285, name: "Scorbuthoveen, el Sordo" },
  { id: 2482, name: "Sepaulturero Kleealak, el Arquitecto" },
  { id: 2287, name: "Serpistol, el Afónico" },
  { id: 2600, name: "Setal Slugdor, el Exterminador" },
  { id: 2551, name: "Setsa'n Desiti, la Amistosa" },
  { id: 2567, name: "Siegálaher, los Chulos" },
  { id: 2588, name: "Sparito, el Feo" },
  { id: 2347, name: "Spío, el Dragón" },
  { id: 2345, name: "Spionter Vellde, el Peligroso" },
  { id: 2289, name: "Sushij, el Makisan" },
  { id: 2546, name: "Tofofo, el Blandito" },
  { id: 2356, name: "Tofumado, el Alucinado" },
  { id: 2357, name: "Tofumantxú, el Mítico" },
  { id: 2296, name: "Tortruquini, el Inspector" },
  { id: 2295, name: "Tortugadget, el Inspector" },
  { id: 2297, name: "Tortugo Projatt, el Corto" },
  { id: 2298, name: "Tortugríssom, el Doctor" },
  { id: 2601, name: "Trompsosis, el Cardiaco" },
  { id: 2300, name: "Troolbin, el de los Bolsquels" },
  { id: 2299, name: "Trroncky III, el Tigre" },
  { id: 2382, name: "Tufaldo Aréneo, el Marielito" },
  { id: 2547, name: "Tufóbico, el Miedoso" },
  { id: 2589, name: "Uginukem, el Duque" },
  { id: 2302, name: "Vamorespirros, el Múltiple" },
  { id: 2308, name: "Wabibip Woyote, el Persistente" },
  { id: 2307, name: "Warjamer, el Miniaturista" },
  { id: 2306, name: "Warkamole, el Apetitoso" },
  { id: 2305, name: "Waybbit Esquelite, el Rebelde" },
  { id: 2304, name: "Wogew Wabbit, el Engañado" },
  { id: 2495, name: "Zampatávoro, el Miliano" },
  { id: 2286, name: "Zumburdieu el Social" },
  { id: 4350, name: "Gargantúa, la Devoradora" },
  { id: 4352, name: "Dárdamel, la Secuestradora" },
];

const DEMO_VISIBLE_COUNT = 8;
const DEMO_ROTATE_MS = 5000;

function demoImageUrl(id: number) {
  return `https://raw.githubusercontent.com/Gianxaje/kkkal/main/imgBLUR/${id}.png`;
}

const APPEARED_PREFIX: Record<Lang, string> = { es: "Apareció hace", fr: "Apparu il y a", en: "Appeared" };
const APPEARED_SUFFIX: Record<Lang, string> = { es: "", fr: "", en: "ago" };
const LIVE_UNITS: Record<Lang, { h: string; min: string; s: string }> = {
  es: { h: "h", min: "min", s: "s" },
  fr: { h: "h", min: "min", s: "s" },
  en: { h: "h", min: "min", s: "s" },
};

function formatElapsed(msSince: number, lang: Lang): string {
  const totalSeconds = Math.max(0, Math.floor(msSince / 1000));
  const u = LIVE_UNITS[lang];
  let core: string;
  if (totalSeconds < 60) {
    core = `${totalSeconds}${u.s}`;
  } else {
    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes < 60) {
      core = `${totalMinutes} ${u.min}`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      core = `${hours}${u.h} ${minutes}${u.min}`;
    }
  }
  return [APPEARED_PREFIX[lang], core, APPEARED_SUFFIX[lang]].filter(Boolean).join(" ");
}

function LivePage() {
  return (
    <Layout>
      <LiveFeed />
    </Layout>
  );
}

function LiveFeed() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<ArchimonstruoActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [live, setLive] = useState(false);
  const itemsRef = useRef<ArchimonstruoActivo[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [demoVisible, setDemoVisible] = useState<{ id: number; name: string }[]>([]);

  function mergeSorted(list: ArchimonstruoActivo[]) {
    const sorted = [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const limited = sorted.slice(0, MAX_VISIBLE);
    itemsRef.current = limited;
    setItems(limited);
  }

  async function loadInitial() {
    try {
      const res = await fetch("https://api.bnotifier.es/archimonstruos");
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError(`Error ${res.status}`);
      } else {
        setError(null);
        mergeSorted(Array.isArray(data) ? data : []);
      }
    } catch {
      setError(t("live_couldNotConnect"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, []);

  useEffect(() => {
    loadInitial();
    const fallbackId = setInterval(loadInitial, FALLBACK_REFRESH_MS);
    return () => clearInterval(fallbackId);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("https://api.bnotifier.es/stats");
        const data = await res.json().catch(() => null);
        if (res.ok && data) setStats(data);
      } catch {
        // Si falla, simplemente no se muestra el bloque de stats.
      }
    }
    loadStats();
    const statsId = setInterval(loadStats, STATS_REFRESH_MS);
    return () => clearInterval(statsId);
  }, []);

  useEffect(() => {
    const source = new EventSource("https://api.bnotifier.es/events");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      try {
        const incoming: ArchimonstruoActivo = JSON.parse(event.data);
        const withoutDuplicate = itemsRef.current.filter((a) => a.id !== incoming.id);
        mergeSorted([incoming, ...withoutDuplicate]);
      } catch {
        // Mensaje no reconocido, se ignora.
      }
    };

    return () => source.close();
  }, []);

  // Rotación de la demo: solo corre mientras no haya archimonstruos reales
  // activos. En cuanto items.length pase a ser > 0 (datos reales del bot),
  // este efecto se limpia solo y deja de rotar.
  useEffect(() => {
    if (loading || items.length > 0) return;

    function pickRandom(exclude: Set<number>) {
      const available = DEMO_POOL.filter((p) => !exclude.has(p.id));
      const pool = available.length > 0 ? available : DEMO_POOL;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    setDemoVisible((prev) => {
      if (prev.length > 0) return prev;
      const used = new Set<number>();
      const seeded: { id: number; name: string }[] = [];
      for (let i = 0; i < DEMO_VISIBLE_COUNT; i++) {
        const pick = pickRandom(used);
        used.add(pick.id);
        seeded.push(pick);
      }
      return seeded;
    });

    const rotateId = setInterval(() => {
      setDemoVisible((prev) => {
        const used = new Set(prev.map((p) => p.id));
        const next = pickRandom(used);
        return [next, ...prev].slice(0, DEMO_VISIBLE_COUNT);
      });
    }, DEMO_ROTATE_MS);

    return () => clearInterval(rotateId);
  }, [loading, items.length]);

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label flex items-center gap-2">
            <span className={live ? "live-dot" : "live-dot opacity-30"} aria-hidden="true" />
            {live ? t("liveLabel") : t("connectingLabel")}
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {t("activeArchisTitle")}
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            {t("live_pageDesc")}
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">{t("live_todayLabel")}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{stats.archimonstrosHoy}</div>
          </div>
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">{t("live_activeLicensesLabel")}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">
              {stats.licenciasActivas}
            </div>
          </div>
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">{t("live_mostSearchedLabel")}</div>
            <div className="mt-1 truncate font-display text-lg font-semibold">
              {stats.masBuscado ? stats.masBuscado.name : "—"}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="py-10 text-center text-muted-foreground">{t("loadingLabel")}</p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-destructive">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="space-y-5">
          <div className="surface-card border-primary/30 px-5 py-4 text-center">
            <span className="mono-label text-primary">{t("live_previewLabel")}</span>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("live_previewDesc")}
            </p>
          </div>
          <ul
            role="list"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {demoVisible.map((a) => (
              <li key={a.id}>
                <Link
                  to="/price"
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-primary/60 hover:bg-surface-2 focus-visible:border-primary focus-visible:outline-none"
                >
                  <span className="mono-label absolute right-2 top-2 rounded-full border border-primary/50 bg-background/80 px-2 py-0.5 text-[0.55rem] text-primary">
                    DEMO
                  </span>
                  <img
                    src={demoImageUrl(a.id)}
                    alt=""
                    loading="lazy"
                    onError={handleMonsterImgError}
                    className="h-20 w-20 rounded-lg object-contain transition-transform group-hover:scale-105"
                  />
                  <span className="flex min-h-[3.2rem] items-center justify-center font-display text-sm font-semibold leading-tight">
                    {translateArchmonsterName(a.id, a.name, lang)}
                  </span>
                  <span className="mono-label text-[0.65rem] text-muted-foreground">
                    Blair
                  </span>
                  <span className="mono-label rounded-full border border-primary/30 px-2.5 py-0.5 text-[0.65rem] text-primary">
                    {t("live_viewPosition")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul
          role="list"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {items.map((a) => {
            const registeredAt = new Date(a.date).getTime();
            const elapsedMs = now - registeredAt;

            return (
              <li key={a.id}>
                <Link
                  to="/position/$id"
                  params={{ id: String(a.id) }}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-primary/60 hover:bg-surface-2 focus-visible:border-primary focus-visible:outline-none"
                >
                  <img
                    src={a.imageUrl}
                    alt={a.name}
                    loading="lazy"
                    onError={handleMonsterImgError}
                    className="h-20 w-20 rounded-lg object-contain transition-transform group-hover:scale-105"
                  />
                  <span className="flex min-h-[3.2rem] items-center justify-center font-display text-sm font-semibold leading-tight">
                    {translateArchmonsterName(a.id, a.name, lang)}
                  </span>
                  <span className="mono-label text-[0.65rem] text-muted-foreground">
                    {a.server}
                  </span>
                  <span className="mono-label rounded-full border border-primary/30 px-2.5 py-0.5 text-[0.65rem] text-primary">
                    {formatElapsed(elapsedMs, lang)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
