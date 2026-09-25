// Rôle : Tests automatisés de cette fonctionnalité.
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { fakeApi, renderPage, product, article } from './fixtures';
import Home from '../src/pages/home/Home';
import Shop from '../src/pages/shop/Shop';
import ProductDetail from '../src/pages/product/ProductDetail';
import Blog from '../src/pages/blog/Blog';
import BlogArticle from '../src/pages/blog/BlogArticle';
import CustomBouquet from '../src/pages/custom-bouquet/CustomBouquet';
import Cart from '../src/pages/cart/Cart';
import OrderSuccess from '../src/pages/orders/OrderSuccess';
import OrderCancelled from '../src/pages/orders/OrderCancelled';
import Account from '../src/pages/account/Account';
import Community from '../src/pages/community/Community';
import AdminDashboard from '../src/pages/admin/AdminDashboard';
import ChatWidget from '../src/components/chat/ChatWidget';
import ForgotPassword from '../src/pages/account/ForgotPassword';
import ResetPassword from '../src/pages/account/ResetPassword';
import VerifyEmail from '../src/pages/account/VerifyEmail';

describe('Catalogue, contenu et parcours utilisateurs', () => {
  beforeEach(() => { fakeApi(); });
  it('affiche les vrais produits sur l’accueil et masque le produit technique', async () => {
    renderPage(Home);
    expect(await screen.findByText('Romance')).toBeInTheDocument();
    expect(screen.queryByText('Placeholder')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Les fleurs ont tant à raconter');
  });
  it('filtre la boutique par recherche puis réinitialise', async () => {
    renderPage(Shop); await screen.findByText('Romance');
    fireEvent.change(screen.getByPlaceholderText(/Rechercher un bouquet/), { target: { value: 'Secret' } });
    expect(screen.queryByText('Romance')).not.toBeInTheDocument();
    expect(screen.getByText('Jardin Secret')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser les filtres' }));
    expect(screen.getByText('Romance')).toBeInTheDocument();
  });
  it('filtre la boutique par occasion et budget', async () => {
    renderPage(Shop); await screen.findByText('Romance');
    fireEvent.click(screen.getByRole('button', { name: 'Mariage' }));
    expect(screen.queryByText('Jardin Secret')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '20' } });
    expect(screen.queryByText('Romance')).not.toBeInTheDocument();
    expect(screen.getByText(/Aucun produit/)).toBeInTheDocument();
  });
  it.each(['prix-asc', 'prix-desc'])('trie les prix dans la boutique (%s)', async (sort) => {
    const { container } = renderPage(Shop); await screen.findByText('Romance');
    fireEvent.click(screen.getByRole('button', { name: 'Trier les bouquets' }));
    fireEvent.click(screen.getByRole('option', { name: sort === 'prix-asc' ? 'Prix croissant' : 'Prix décroissant' }));
    const names = [...container.querySelectorAll('.product-name')].map(node => node.textContent);
    expect(names).toEqual(sort === 'prix-asc' ? ['Romance', 'Jardin Secret'] : ['Jardin Secret', 'Romance']);
  });
  it('invite à se connecter avant un ajout aux favoris', async () => {
    const fetchMock = fakeApi(); renderPage(Shop); await screen.findByText('Romance');
    fireEvent.click(screen.getAllByRole('button', { name: 'Ajouter aux favoris' })[0]);
    expect(await screen.findByRole('status')).toHaveTextContent('Créez un compte');
    expect(fetchMock.mock.calls.some(([url, opts]) => new URL(url).pathname.startsWith('/favorites/') && opts.method === 'POST')).toBe(false);
  });
  it('ajoute puis retire un favori pour un membre', async () => {
    const fetchMock = fakeApi({ '/favorites/q': {} }); renderPage(Shop, { signedIn: true }); await screen.findByText('Romance');
    fireEvent.click(screen.getAllByRole('button', { name: 'Ajouter aux favoris' })[0]);
    await screen.findByRole('button', { name: 'Retirer des favoris' });
    fireEvent.click(screen.getByRole('button', { name: 'Retirer des favoris' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Retirer des favoris' })).not.toBeInTheDocument());
    expect(fetchMock.mock.calls.some(([, opts]) => opts.method === 'DELETE')).toBe(true);
  });
  it('affiche une erreur de chargement de la boutique', async () => {
    fakeApi({ '/products': new Error('Catalogue indisponible') }); renderPage(Shop);
    expect(await screen.findByText('Catalogue indisponible')).toBeInTheDocument();
  });
  it('ajoute la quantité choisie au panier depuis la fiche produit', async () => {
    renderPage(ProductDetail, { path: '/produit/p', route: '/produit/:id' });
    await screen.findByRole('heading', { level: 1, name: 'Romance' });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: /Ajouter au panier/ }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('floresia-cart'))[0].quantity).toBe(2));
  });
  it('affiche une fiche introuvable sans permettre l’achat', async () => {
    fakeApi({ '/products/p': null }); renderPage(ProductDetail, { path: '/produit/p', route: '/produit/:id' });
    expect(await screen.findByRole('heading', { name: 'Produit introuvable' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Ajouter au panier/ })).not.toBeInTheDocument();
  });
  it('filtre le blog et réinitialise une recherche sans résultat', async () => {
    renderPage(Blog); await screen.findAllByText(article.title);
    fireEvent.change(screen.getByPlaceholderText('Rechercher un article...'), { target: { value: 'inexistant' } });
    expect(screen.getByText(/Aucun article ne correspond/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser la recherche' }));
    expect(screen.getByRole('heading', { level: 2, name: article.title })).toBeInTheDocument();
  });
  it('affiche un article et invite un visiteur à se connecter pour commenter', async () => {
    renderPage(BlogArticle, { path: '/blog/a', route: '/blog/:id' });
    expect(await screen.findByRole('heading', { level: 1, name: article.title })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Écrivez votre commentaire/)).not.toBeInTheDocument();
  });
  it('affiche un article introuvable après une erreur API', async () => {
    fakeApi({ '/articles': [] }); renderPage(BlogArticle, { path: '/blog/a', route: '/blog/:id' });
    expect(await screen.findByRole('heading', { name: 'Article introuvable' })).toBeInTheDocument();
  });
  it('affiche les contenus communautaires sans autoriser la publication anonyme', async () => {
    renderPage(Community); await screen.findByText('Les voix de la communauté');
    expect(screen.queryByPlaceholderText('Racontez-nous votre expérience...')).not.toBeInTheDocument();
  });
  it('affiche les formulaires de publication pour un compte vérifié', async () => {
    renderPage(Community, { signedIn: true });
    expect(await screen.findByPlaceholderText('Racontez-nous votre expérience...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('@votre_pseudo')).toBeInTheDocument();
  });
  it('affiche la connexion pour un visiteur', async () => {
    renderPage(Account);
    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
  });
  it('ouvre le formulaire d’inscription', async () => {
    renderPage(Account);
    fireEvent.click(screen.getAllByRole('button', { name: /Inscription|Créer un compte/ })[0]);
    expect(screen.getByRole('heading', { name: 'Inscription' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sophie')).toBeInTheDocument();
  });
  it.each([
    ['Mes Commandes', 'Mes Commandes'], ['Adresses', 'Mes Adresses'],
    ['Favoris', 'Mes Favoris'], ['Mon Profil', 'Mon Profil'],
  ])('ouvre l’onglet du compte %s', async (button, heading) => {
    renderPage(Account, { signedIn: true }); await screen.findByText('Bienvenue, Flora !');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(button, 'i') }));
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
  });
  it('ouvre le formulaire d’adresse du compte connecté', async () => {
    renderPage(Account, { signedIn: true }); await screen.findByText('Bienvenue, Flora !');
    fireEvent.click(screen.getByRole('button', { name: /^Adresses$/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Ajouter.*adresse/i }));
    expect(screen.getByPlaceholderText('Domicile, Travail…')).toBeInTheDocument();
  });
  it('protège le tableau de modération d’un compte utilisateur', async () => {
    const fetchMock = fakeApi(); renderPage(AdminDashboard, { route: '/admin', path: '/admin', signedIn: true });
    expect(await screen.findByText('Destination')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('permet à un administrateur de consulter les trois listes', async () => {
    renderPage(AdminDashboard, { signedIn: true, role: 'ADMIN' });
    expect(await screen.findByText('Aucun commentaire.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Avis/ }));
    expect(screen.getByText('Aucun avis.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Photos/ }));
    expect(screen.getByText('Aucune photo.')).toBeInTheDocument();
  });
  it('explique un échec de chargement de la modération', async () => {
    fakeApi({ '/comments/admin/all': new Error('Offline') }); renderPage(AdminDashboard, { signedIn: true, role: 'ADMIN' });
    expect(await screen.findByRole('alert')).toHaveTextContent('ne peuvent pas être chargés');
  });
});

describe('Composition, panier et statut du paiement', () => {
  beforeEach(() => { fakeApi(); });
  it('affiche un panier vide sans bouton de paiement', async () => {
    renderPage(Cart); expect(screen.getByRole('heading', { name: 'Votre panier est vide' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Payer|commande/i })).not.toBeInTheDocument();
  });
  it('calcule le total avec les frais et permet de retirer le produit', async () => {
    renderPage(Cart, { cart: [{ ...product, quantity: 1 }] });
    expect(screen.getAllByText(/37,90\s*€/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter quantité' }));
    expect(screen.getAllByText(/64,00\s*€/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Retirer du panier' }));
    expect(screen.getByRole('heading', { name: 'Votre panier est vide' })).toBeInTheDocument();
  });
  it('retire les frais de livraison lors du choix du retrait', async () => {
    renderPage(Cart, { signedIn: true, cart: [{ ...product, quantity: 1 }] });
    fireEvent.click(screen.getByRole('button', { name: /Retrait/i }));
    expect(screen.getAllByText(/32,00\s*€/).length).toBeGreaterThan(0);
  });
  it('annuler un paiement conserve le panier', async () => {
    renderPage(OrderCancelled, { cart: [{ ...product, quantity: 1 }] });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/paiement/i);
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1);
  });
  it('une URL de succès sans commande ne confirme aucun paiement', async () => {
    const fetchMock = fakeApi(); renderPage(OrderSuccess);
    expect(screen.getByRole('status')).toHaveTextContent('Aucune commande');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('demande une connexion avant de vérifier une commande', async () => {
    renderPage(OrderSuccess, { path: '/commande/succes?orderId=o' });
    expect(screen.getByRole('status')).toHaveTextContent('Connectez-vous');
  });
  it.each(['PENDING', 'CANCELLED'])('ne vide pas le panier pour le statut %s', async (status) => {
    fakeApi({ '/orders/o': { id: 'o', status } });
    renderPage(OrderSuccess, { signedIn: true, path: '/commande/succes?orderId=o', cart: [{ ...product, quantity: 1 }] });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(status === 'PENDING' ? 'en attente' : 'annulée'));
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1);
  });
  it('vide le panier uniquement lorsque le serveur confirme son paiement', async () => {
    const cart = [{ ...product, quantity: 1 }];
    fakeApi({ '/orders/o': { id: 'o', status: 'PAID' } });
    sessionStorage.setItem('floresia-checkout', JSON.stringify({ orderId: 'o', cart: JSON.stringify(cart) }));
    renderPage(OrderSuccess, { signedIn: true, path: '/commande/succes?orderId=o', cart });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('bien été confirmé'));
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toEqual([]);
    expect(sessionStorage.getItem('floresia-checkout')).toBeNull();
  });
  it('préserve un panier modifié après le départ vers Stripe', async () => {
    fakeApi({ '/orders/o': { id: 'o', status: 'PAID' } });
    sessionStorage.setItem('floresia-checkout', JSON.stringify({ orderId: 'o', cart: '[]' }));
    renderPage(OrderSuccess, { signedIn: true, path: '/commande/succes?orderId=o', cart: [{ ...product, quantity: 1 }] });
    await screen.findByRole('heading', { name: 'Merci pour votre commande !' });
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1);
  });
  it('signale un échec de vérification sans confirmer le paiement', async () => {
    fakeApi({ '/orders/o': new Error('Forbidden') }); renderPage(OrderSuccess, { signedIn: true, path: '/commande/succes?orderId=o' });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('pas pu être vérifiée'));
  });
  it.each([true, false])('compose un bouquet avec ou sans feuillage (%s)', async (withFoliage) => {
    renderPage(CustomBouquet);
    await screen.findByRole('heading', { name: 'Pour quelle occasion ?' });
    fireEvent.click(screen.getByRole('button', { name: /Mariage/ }));
    fireEvent.click(screen.getByRole('button', { name: /Suivant/ }));
    await screen.findByRole('heading', { name: 'Composez votre bouquet' });
    expect(screen.queryByText('Eucalyptus Vert')).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: /Ajouter/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter' }));
    fireEvent.click(screen.getByRole('button', { name: /Suivant/ }));
    const touches = screen.getByRole('heading', { name: 'Ajoutez des touches florales' }).parentElement;
    if (withFoliage) fireEvent.click(within(touches).getByRole('button', { name: /Eucalyptus Vert/ }));
    expect(within(touches).getByText(/\+2,00\s*€/)).toHaveTextContent('/ tige');
    fireEvent.click(screen.getByRole('button', { name: /Suivant/ }));
    fireEvent.click(screen.getByRole('button', { name: /Ajouter au panier/ }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1));
    const item = JSON.parse(localStorage.getItem('floresia-cart'))[0];
    expect(item.price).toBe(withFoliage ? 12.5 : 10.5);
    expect(item.customConfig.secondaryFlowers).toEqual(withFoliage ? ['e'] : []);
  });
});

describe('Flora et récupération de compte', () => {
  beforeEach(() => { fakeApi(); });
  it('envoie une question à Flora sans inclure le message d’accueil dans l’historique', async () => {
    const fetchMock = fakeApi(); const { container } = renderPage(ChatWidget);
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le chat avec Flora' }));
    fireEvent.change(screen.getByPlaceholderText('Écrivez à Flora...'), { target: { value: '  Prix des roses ?  ' } });
    fireEvent.submit(container.querySelector('form'));
    expect(await screen.findByText('Les roses coûtent 3,50 € la tige.')).toBeInTheDocument();
    const call = fetchMock.mock.calls.find(([url]) => new URL(url).pathname === '/chatbot/message');
    expect(JSON.parse(call[1].body)).toEqual({ message: 'Prix des roses ?', history: [] });
  });
  it('affiche une erreur de Flora et permet de réessayer', async () => {
    fakeApi({ '/chatbot/message': new Error('Flora indisponible') }); const { container } = renderPage(ChatWidget);
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le chat avec Flora' }));
    fireEvent.change(screen.getByPlaceholderText('Écrivez à Flora...'), { target: { value: 'Bonjour' } });
    fireEvent.submit(container.querySelector('form'));
    expect(await screen.findByText('Flora indisponible')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Écrivez à Flora...')).not.toBeDisabled();
  });
  it('affiche une confirmation neutre après une demande de récupération', async () => {
    fakeApi({ '/auth/forgot-password': { message: 'Si un compte existe' } }); renderPage(ForgotPassword);
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'flora@example.test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recevoir le lien' }));
    expect(await screen.findByText(/Si un compte existe avec cet email/)).toBeInTheDocument();
  });
  it('signale une erreur de récupération du compte', async () => {
    fakeApi({ '/auth/forgot-password': new Error('Envoi impossible') }); renderPage(ForgotPassword);
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'flora@example.test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recevoir le lien' }));
    expect(await screen.findByText('Envoi impossible')).toBeInTheDocument();
  });
  it.each([
    ['', 'LongPassword123!', 'LongPassword123!', 'Lien invalide.'],
    ['?token=t', 'LongPassword123!', 'different', 'Les deux mots de passe ne correspondent pas.'],
    ['?token=t', 'weak', 'weak', 'Le mot de passe doit contenir au moins 12 caractères'],
  ])('refuse une réinitialisation invalide (%s)', async (query, first, second, error) => {
    const fetchMock = fakeApi(); const { container } = renderPage(ResetPassword, { path: '/reset' + query });
    const inputs = container.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: first } }); fireEvent.change(inputs[1], { target: { value: second } });
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }));
    expect(screen.getByText(new RegExp(error.replace('.', '\\.')))).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('réinitialise un mot de passe valide', async () => {
    fakeApi({ '/auth/reset-password': {} }); const { container } = renderPage(ResetPassword, { path: '/reset?token=t' });
    for (const input of container.querySelectorAll('input')) fireEvent.change(input, { target: { value: 'LongPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }));
    expect(await screen.findByText(/Mot de passe réinitialisé avec succès/)).toBeInTheDocument();
  });
  it('filtre le code email et transmet les six chiffres', async () => {
    const fetchMock = fakeApi({ '/auth/verify-email': {} });
    const { auth } = renderPage(VerifyEmail, { state: { email: 'flora@example.test' }, signedIn: true });
    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: 'abc123456' } });
    expect(screen.getByPlaceholderText('123456')).toHaveValue('123456');
    fireEvent.click(screen.getByRole('button', { name: 'Valider le code' }));
    expect(await screen.findByText('Email vérifié avec succès !')).toBeInTheDocument();
    expect(auth.updateUser).toHaveBeenCalledWith({ isEmailVerified: true });
    const call = fetchMock.mock.calls.find(([url]) => new URL(url).pathname === '/auth/verify-email');
    expect(JSON.parse(call[1].body)).toEqual({ email: 'flora@example.test', code: '123456' });
  });
});
