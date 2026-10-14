// Typographie française pour les textes saisis dans l'interface d'administration : une espace
// insécable avant : ; ! ? » et après «, pour que la ponctuation ne parte jamais seule à la ligne.
export const typo = (texte: string) => texte.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
