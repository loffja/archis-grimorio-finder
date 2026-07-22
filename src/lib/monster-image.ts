// Placeholder que se muestra cuando la imagen de un archimonstruo todavía no
// existe en el repositorio de imágenes (404) — un cuadro oscuro con una X en
// vez de dejar el ícono de "imagen rota" del navegador.
export const MONSTER_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='12' fill='%2317171c'/%3E%3Cpath d='M27 27l26 26M53 27L27 53' stroke='%238a8a94' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E";

export function handleMonsterImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.onerror = null; // evita bucles si el propio placeholder fallara
  img.src = MONSTER_IMAGE_FALLBACK;
}
