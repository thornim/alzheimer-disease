const sousCategoriesParCategorie = {
  depistage: [
    { value: 'population_generale', label: 'Population générale' }
  ],
  diagnostic_precoce: [
    { value: 'plainte_cognitive', label: 'Plainte cognitive' },
    { value: 'alerte_entourage', label: 'Alerte de l’entourage' },
    { value: 'situations_cliniques', label: 'Situations cliniques à risque' },
    { value: 'benefices', label: 'Bénéfices' }
  ],
  evaluation_initiale: [
    { value: 'entretien', label: 'Entretien' },
    { value: 'antecedents', label: 'Antécédents' },
    { value: 'retentissement', label: 'Retentissement' },
    { value: 'mmse', label: 'MMSE' }
  ],
  diagnostic: [
    { value: 'causes_alternatives', label: 'Causes alternatives' }
  ],
  examens: [
    { value: 'biologie', label: 'Biologie' },
    { value: 'imagerie', label: 'Imagerie' }
  ],
  orientation: [
    { value: 'avis_specialise', label: 'Avis spécialisé' }
  ],
  annonce: [
    { value: 'consultation_dediee', label: 'Consultation dédiée' }
  ],
  prise_en_charge: [
    { value: 'plan_soins', label: 'Plan de soins' }
  ],
  interventions_non_medicamenteuses: [
    { value: 'approche_globale', label: 'Approche globale' }
  ],
  aidants: [
    { value: 'soutien', label: 'Soutien' }
  ],
  suivi: [
    { value: 'medecin_traitant', label: 'Médecin traitant' },
    { value: 'contenu_consultation', label: 'Contenu de consultation' }
  ],
  securite: [
    { value: 'environnement_juridique', label: 'Environnement et juridique' }
  ]
};

const form = document.getElementById('form-api');
const apiUrlInput = document.getElementById('apiUrl');
const categorieInput = document.getElementById('categorie');
const sousCategorieInput = document.getElementById('sousCategorie');
const publicInput = document.getElementById('public');
const message = document.getElementById('message');
const resume = document.getElementById('resume');
const resultats = document.getElementById('resultats');
const btnReset = document.getElementById('btnReset');

function afficherMessage(texte, type = '') {
  message.textContent = texte;
  message.className = `message ${type}`.trim();
}

function remplirSousCategories(categorie) {
  sousCategorieInput.innerHTML = '<option value="">Toutes</option>';

  if (!categorie || !sousCategoriesParCategorie[categorie]) {
    sousCategorieInput.disabled = true;
    return;
  }

  sousCategoriesParCategorie[categorie].forEach((item) => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    sousCategorieInput.appendChild(option);
  });

  sousCategorieInput.disabled = false;
}

function creerCarte(item) {
  const carte = document.createElement('article');
  carte.className = 'carte-resultat';
  carte.innerHTML = `
    <div class="meta">
      <span class="badge">${item.categorie || 'Non précisée'}</span>
      <span class="badge badge-secondaire">${item.public || 'Tous'}</span>
    </div>
    <h3>${item.titre || 'Sans titre'}</h3>
    <p><strong>Sous-catégorie :</strong> ${item.sous_categorie || 'Non précisée'}</p>
    <p>${item.contenu || 'Aucun contenu disponible.'}</p>
    <p class="source"><strong>Source :</strong> ${item.source || 'Non précisée'}</p>
  `;
  return carte;
}

async function testerApi(e) {
  e.preventDefault();
  afficherMessage('Chargement des recommandations...', 'info');
  resume.textContent = '';
  resultats.innerHTML = '';

  try {
    const url = new URL(apiUrlInput.value.trim());

    if (categorieInput.value) url.searchParams.set('categorie', categorieInput.value);
    if (sousCategorieInput.value) url.searchParams.set('sous_categorie', sousCategorieInput.value);
    if (publicInput.value) url.searchParams.set('public', publicInput.value);

    const reponse = await fetch(url.toString());
    if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`);

    const donnees = await reponse.json();

    if (!Array.isArray(donnees) || donnees.length === 0) {
      afficherMessage('Aucune recommandation trouvée pour ces filtres.', 'warning');
      resume.textContent = '0 résultat';
      return;
    }

    afficherMessage('Requête réussie.', 'success');
    resume.textContent = `${donnees.length} résultat(s) trouvé(s)`;
    donnees.forEach((item) => resultats.appendChild(creerCarte(item)));
  } catch (erreur) {
    afficherMessage("Erreur : impossible de contacter l'API.", 'error');
    resume.textContent = '';
  }
}

function reinitialiserPage() {
  afficherMessage('');
  resume.textContent = '';
  resultats.innerHTML = '';
  remplirSousCategories('');
}

categorieInput.addEventListener('change', (e) => remplirSousCategories(e.target.value));
form.addEventListener('submit', testerApi);
btnReset.addEventListener('click', () => setTimeout(reinitialiserPage, 0));
remplirSousCategories('');

document.querySelector(".btn-principal").addEventListener("click", function () {
  document.getElementById("bloc-resultats").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});