# Mon implémentation

Les valeurs de configuration sont stockées dans la clé `"intent-configuration"` du `localStorage`.  
Voir les fichiers : `components/AcceptCGU`, `helpers/localStorageHelper` et `domains/intents/ScreenRenderer/index.utils.ts`.

J'ai découpé le code selon le **Domain Design** afin d'avoir un fichier ou répertoire par couche pour mieux s'y repérer :

- **Model** : les types de données
- **Utils** : fonctions/utilitaires utilisés par mes composants
- **Hooks** : hooks spécifiques au domaine (non génériques)
- **Const** : constantes
- **Mock** : mocks des API, notamment pour simuler les intents

Pour aller plus loin, j'aurais pu créer un `useFetch` plus générique dans `shared/hooks/useFetch` qui renverrait `{ data, loading, error }`, ou bien utiliser une librairie dédiée.

---

Si on souhaite étendre les configurations du `visibleIf`, il faudra :

1. Mettre à jour les clés dans `localStorageHelper`.
2. Mettre à jour la propriété correspondante de la clé `intent-configuration` du `localStorage` via le composant dédié.

Pour aller plus loin, j'aurais pu optimiser le ré-affichage du composant pour qu'il ne se mette à jour **que quand les conditions `visible-if` changent**.  
Je me suis limité à le ré-afficher uniquement quand la clé du `localStorage` `"intent-configuration"` est modifiée.

---

# Test technique — SPA dynamique pilotée par le serveur

## Lancer le projet

Assurez-vous d'utiliser **Node.js version 22**.

```bash
yarn install
yarn run dev

```

Accédez ensuite à `http://localhost:5173/screen/page-a` ou `/screen/page-b` pour tester.

---

## Enoncé

Nous souhaitons implémenter une application web dont l'interface est entièrement pilotée par le serveur. L'application interroge une API `GET /intents/:screenId` pour déterminer dynamiquement quels composants afficher et avec quelles données.

Par exemple, pour `GET /intents/page-a`, l’API renverrait :

```json
{
  "address-form": { "default": "16 RUE DE LA VILLE LEVEQUE 75008 PARIS" },
  "button": { "label": "Envoyer" }
}
```

Chaque clé représente un composant à afficher, et chaque valeur correspond à ses props.

Dans ce test, l’API n’existe pas encore. Elle est simulée via la fonction `fetchIntents` disponible dans `/src/mock/intents.ts`.

---

## Intents actuellement supportés

| Nom de l’intent | Composant associé |
| --------------- | ----------------- |
| `address-form`  | `<AddressForm />` |
| `accept-cgu`    | `<AcceptCGU />`   |
| `button`        | `<Button />`      |

Les composants sont déjà codés et importables depuis `src/components/`. Nous prévoyons de supporter à terme entre 80 et 100 intents.

---

## Objectifs

1. Appeler `fetchIntents(screenId)` pour simuler un appel à l’API.
2. Pour chaque intent, afficher dynamiquement le composant correspondant avec les bonnes props.
3. Respecter l’ordre dans lequel les intents sont retournés.

Vous devez écrire cette logique dans le fichier `ScreenRenderer.tsx`.

Vous pouvez centraliser toute la logique dans ce fichier. La clarté et la fonctionnalité priment sur la structure.

---

## Bonus : `visible-if`

Certains intents peuvent inclure une condition d'affichage :

```json
{
  "address-form": {
    "visible-if": { "accept-cgu": true },
    "default": "16 RUE DE LA VILLE LEVEQUE 75008 PARIS"
  }
}
```

Cela signifie que `address-form` ne doit s’afficher que si la case du composant `AcceptCGU` est cochée.

Idéalement, on voudrait pouvoir supporter des conditions plus complexes, par exemple `{ form-is-valid: "name of form" }`, `{ localization-is-valid: true }`, `{ age-is-over-18: true }`, etc.
Ces conditions supplémentaires ne sont pas à implémenter. Elles sont données uniquement en exemple pour vous donner une idée sur comment le produit devrait évoluer.

---

## Correction

### Éliminatoire

- Le rendu des composants de base ne fonctionne pas
- Les règles fondamentales de React ne sont pas respectées

### Acceptable

- Le rendu dynamique fonctionne même si tout est dans `ScreenRenderer.tsx`
- La partie `visible-if` n’est pas gérée

### Valorisé

- Le rendu conditionnel fonctionne (`visible-if`)
- Code clair, logique, bien découpé

---

## Temps estimé

30 à 45 minutes
