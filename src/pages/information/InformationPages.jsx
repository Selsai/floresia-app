// Rôle : Page et interactions de cette fonctionnalité.
// InformationPages : pages de contact et de politique du site.
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import './InformationPages.css';

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'contact.floresia@gmail.com';
const editorName = import.meta.env.VITE_EDITOR_NAME?.trim() || 'Selsabil Amairi';
const hostName = import.meta.env.VITE_HOST_NAME?.trim() || 'Hostinger';
const hostContact = import.meta.env.VITE_HOST_CONTACT?.trim();

function InformationPage({ title, intro, children }) {
  return (
    <article className="information-page container">
      <header className="information-page__hero">
        <p className="information-page__eyebrow">Florésia · projet pédagogique</p>
        <h1>{title}</h1>
        <p className="information-page__intro">{intro}</p>
      </header>
      <div className="information-page__body">{children}</div>
    </article>
  );
}

function ContactAddress() {
  return contactEmail ? (
    <a href={'mailto:' + contactEmail}>{contactEmail}</a>
  ) : (
    <span>Adresse de contact à renseigner avant la publication du site.</span>
  );
}

export function ContactPage() {
  return (
    <InformationPage title="Contact" intro="Une question sur la démonstration Florésia ou sur vos données ?">
      <section>
        <h2>Écrire à la responsable du projet</h2>
        <p className="information-page__contact"><Mail size={20} aria-hidden="true" /><span>Contacter la responsable du projet</span><ContactAddress /><ArrowUpRight size={18} aria-hidden="true" /></p>
        <p>Pour une demande concernant vos données, indiquez l’adresse email du compte concerné et l’objet de votre demande. Ne transmettez jamais votre mot de passe ou des informations bancaires.</p>
      </section>
      <section>
        <h2>À propos des commandes</h2>
        <p>Florésia est une démonstration pédagogique. Les bouquets, les points de retrait et les paiements affichés servent à tester le parcours ; aucune livraison ni remise de bouquet n’est organisée par ce site.</p>
      </section>
      <section>
        <h2>Des réponses immédiates</h2>
        <p>Flora peut aider à choisir des fleurs. Ses réponses sont générées ou calculées automatiquement et peuvent comporter des erreurs. Évitez d’y écrire des données personnelles sensibles.</p>
        <p><Link to="/confidentialite">Consulter la politique de confidentialité</Link></p>
      </section>
    </InformationPage>
  );
}

export function LegalNoticePage() {
  return (
    <InformationPage title="Mentions légales" intro="Informations sur l’édition et l’hébergement de cette démonstration.">
      <section>
        <h2>Édition du site</h2>
        <p>Florésia est un projet pédagogique de démonstration, sans activité de vente réelle.</p>
        <p>Éditrice du projet : {editorName}, étudiante en informatique et intelligence artificielle.</p>
        <p>Contact : <ContactAddress /></p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>Le site <strong>floresia.fr</strong> et ses fichiers statiques sont hébergés par {hostName}. L’API NestJS est hébergée par Render et accessible depuis le sous-domaine sécurisé <strong>api.floresia.fr</strong>. La base de données PostgreSQL est hébergée par Supabase.</p>
        {hostContact && <p>Coordonnées de l’hébergeur : {hostContact}.</p>}

      </section>
      <section>
        <h2>Contenus et responsabilité</h2>
        <p>Les photographies, textes et éléments graphiques sont présentés dans le cadre du projet Florésia. Leur réutilisation nécessite l’autorisation de leurs titulaires. Les conseils de Flora restent indicatifs ; ils ne remplacent pas un avis professionnel adapté à votre situation.</p>
      </section>
      <p className="information-page__footer-link"><Link to="/contact"><Mail size={18} aria-hidden="true" />Contacter la responsable du projet<ArrowUpRight size={17} aria-hidden="true" /></Link></p>
    </InformationPage>
  );
}

export function ConditionsPage() {
  return (
    <InformationPage title="Conditions de la démonstration" intro="Florésia présente un parcours de boutique fictive. Ces conditions décrivent ce qui est réellement proposé.">
      <section>
        <h2>Absence de vente réelle</h2>
        <p>Les produits, prix, commandes, disponibilités, adresses de retrait et frais affichés servent à illustrer et tester l’application. Aucune vente, réservation, livraison ou remise en magasin n’est réalisée par Florésia dans cette version.</p>
      </section>
      <section>
        <h2>Paiement simulé</h2>
        <p>Le parcours de paiement utilise Stripe en mode test. N’utilisez pas de véritable carte bancaire : seules les données de test fournies par Stripe doivent être utilisées. Le statut de commande affiché dans l’application correspond à la simulation.</p>
      </section>
      <section>
        <h2>Compte et contenus</h2>
        <p>Un compte peut être nécessaire pour essayer le panier, les favoris ou la communauté. Ne renseignez pas de données sensibles. Les textes et images publiés dans la communauté peuvent être visibles par d’autres visiteurs ; ne publiez que des contenus que vous êtes autorisé à partager.</p>
      </section>
      <section>
        <h2>Avant une véritable ouverture commerciale</h2>
        <p>Des conditions générales de vente complètes, des informations sur la livraison et la rétractation, une gestion effective des stocks et des paiements, ainsi que les coordonnées professionnelles, devront être établies et vérifiées avant toute vente réelle.</p>
      </section>
      <p className="information-page__footer-link"><Link to="/contact"><Mail size={18} aria-hidden="true" />Une question sur le projet ?<ArrowUpRight size={17} aria-hidden="true" /></Link></p>
    </InformationPage>
  );
}

export function PrivacyPage() {
  return (
    <InformationPage title="Confidentialité" intro="Les informations ci-dessous décrivent les fonctions présentes dans le code de cette démonstration.">
      <section>
        <h2>Données utilisées</h2>
        <p>La création d’un compte utilise votre nom, prénom, adresse email et, si vous le renseignez, numéro de téléphone. Le mot de passe est conservé sous forme d’empreinte. Les adresses, favoris, commandes simulées et publications sont enregistrés pour faire fonctionner les parcours correspondants.</p>
        <p>Les conversations avec Flora restent visibles dans votre navigateur pendant la session du composant, mais ne sont pas enregistrées comme conversations dans la base de données de Florésia. Les messages et l’historique nécessaires à une réponse non factuelle sont transmis à l’API Gemini. Évitez d’y écrire des informations personnelles ou sensibles.</p>
      </section>
      <section>
        <h2>Services extérieurs</h2>
        <p>Resend sert à envoyer les codes de vérification et les liens de récupération du compte. Stripe gère le paiement simulé. La recherche d’adresse interroge le service public api-adresse.data.gouv.fr après votre saisie. Le choix du retrait peut interroger Overpass avec des coordonnées proches de l’adresse sélectionnée et afficher des tuiles OpenStreetMap. Les polices sont chargées depuis Google Fonts à l’ouverture des pages. Les liens vers les réseaux sociaux ne sont ouverts qu’après un clic.</p>
      </section>
      <section>
        <h2>Stockage dans le navigateur</h2>
        <p>Le navigateur conserve le panier. Selon votre choix « Se souvenir de moi », le jeton de connexion et l’email mémorisé restent dans le stockage local, ou le jeton reste seulement dans le stockage de session. Un identifiant de commande et un état temporaire du panier peuvent être conservés pendant le retour de Stripe. Le détail figure dans la <Link to="/cookies">page Cookies et stockage local</Link>.</p>
      </section>
      <section>
        <h2>Conservation et droits</h2>
        <p>Les données de compte et les publications persistent dans la base tant qu’elles ne sont pas supprimées. Aucune purge automatique ni durée précise n’est actuellement définie dans cette démonstration. Avant d’y saisir des données réelles ou de l’ouvrir au public, une durée de conservation, une procédure de suppression et un contact opérationnel doivent être fixés.</p>
        <p>Pour demander l’accès, la correction ou la suppression de vos données, contactez la responsable du projet : <ContactAddress />. Vous pouvez aussi vous adresser à la CNIL si vous estimez que vos droits ne sont pas respectés.</p>
      </section>
    </InformationPage>
  );
}

export function CookiesPage() {
  const openPreferences = () => window.dispatchEvent(new Event('floresia:open-consent'));
  return (
    <InformationPage title="Cookies et stockage local" intro="Vous gardez le contrôle des stockages et de la mesure d’audience utilisés par Florésia.">
      <section>
        <h2>Ce que le site conserve</h2>
        <ul>
          <li>Panier dans le stockage local : garder les articles sélectionnés après un rechargement.</li>
          <li>Jeton de connexion dans le stockage local si « Se souvenir de moi » est choisi, sinon dans le stockage de session : maintenir la connexion.</li>
          <li>Email mémorisé localement seulement si « Se souvenir de moi » est choisi : préremplir le formulaire de connexion.</li>
          <li>Commande et panier temporaires dans le stockage de session : vérifier le retour du paiement simulé.</li>
        </ul>
        <p>Ces usages servent aux fonctions demandées. Vous pouvez les effacer dans les paramètres de votre navigateur ; cela peut vider le panier ou vous déconnecter.</p>
      </section>
      <section>
        <h2>Services chargés à votre demande</h2>
        <p>L’autocomplétion d’adresse, la recherche de fleuristes et la carte sollicitent des fournisseurs externes lorsque vous utilisez ces fonctions. Flora sollicite Gemini pour certaines questions. Ces services peuvent recevoir des données techniques liées à la requête ; consultez aussi notre <Link to="/confidentialite">politique de confidentialité</Link>.</p>
      </section>
      <section>
        <h2>Choix de consentement</h2>
        <p>La mesure d’audience est facultative et reste bloquée tant que vous ne l’avez pas acceptée. Votre choix est enregistré localement et peut être modifié à tout moment.</p>
        <p><button type="button" className="information-page__preferences" onClick={openPreferences}>Modifier mes préférences</button></p>
      </section>
    </InformationPage>
  );
}
