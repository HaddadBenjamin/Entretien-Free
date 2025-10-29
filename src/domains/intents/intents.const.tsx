import AcceptCGU from "../../components/AcceptCGU";
import AddressForm from "../../components/AddressForm";
import Button from "../../components/Button";

export const COMPONENT_MAP = {
  "address-form": AddressForm,
  "accept-cgu": AcceptCGU,
  button: Button,
} as const;

export const INTENTS = {
  "page-a": {
    "address-form": { default: "16 RUE DE LA VILLE LEVEQUE 75008 PARIS" },
    button: { label: "Envoyer" },
  },

  "page-b": {
    "accept-cgu": { label: "J’accepte les CGU" },
    "address-form": {
      default: "16 RUE DE LA VILLE LEVEQUE 75008 PARIS",
      "visible-if": { "accept-cgu": true },
    },
    button: { label: "Envoyer" },
  },
};
