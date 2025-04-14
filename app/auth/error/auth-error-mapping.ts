/**
 * Retrouvez toutes les erreurs ici : https://authjs.dev/reference/core/errors
 * Messages adaptés pour une meilleure expérience utilisateur.
 */
export const AUTH_ERRORS: Record<string, string> = {
  AccountNotLinked:
    "votre email est déjà utilisé avec un autre compte. veuillez vous connecter avec le compte initialement lié à cet email.",
  AdapterError:
    "un problème technique est survenu lors du traitement de votre demande. veuillez réessayer plus tard.",
  AuthError:
    "une erreur d'authentification s'est produite. veuillez réessayer ou contacter le support si le problème persiste.",
  AuthorizedCallbackError:
    "nous n'avons pas pu vous connecter. veuillez vérifier vos identifiants et réessayer.",
  CallbackRouteError:
    "la connexion a échoué en raison d'un problème technique. veuillez réessayer ou contacter le support.",
  CredentialsSignin:
    "identifiants de connexion invalides. veuillez vérifier vos informations et réessayer.",
  DuplicateConditionalUI:
    "une erreur de configuration s'est produite. veuillez contacter le support.",
  EmailSignInError:
    "un problème est survenu lors du démarrage du processus de connexion avec votre email. veuillez vérifier votre email et réessayer.",
  ErrorPageLoop:
    "une erreur de configuration a empêché l'affichage correct de la page d'erreur. veuillez contacter le support.",
  EventError:
    "un problème technique est survenu lors du traitement de votre demande. veuillez réessayer plus tard.",
  ExperimentalFeatureNotEnabled:
    "cette fonctionnalité n'est pas disponible. veuillez contacter le support pour plus d'informations.",
  InvalidCallbackUrl:
    "l'url fournie n'est pas valide. veuillez réessayer avec une url valide.",
  InvalidCheck:
    "une vérification de sécurité a échoué. veuillez réessayer ou contacter le support si le problème persiste.",
  InvalidEndpoints:
    "une erreur de configuration technique s'est produite. veuillez contacter le support.",
  InvalidProvider:
    "la méthode de connexion sélectionnée n'est pas prise en charge. veuillez choisir une autre méthode ou contacter le support.",
  JWTSessionError:
    "une erreur de session s'est produite. veuillez vous reconnecter.",
  MissingAdapter:
    "une configuration technique est manquante. veuillez contacter le support.",
  MissingAdapterMethods:
    "une partie de la configuration est manquante. veuillez contacter le support pour plus d'aide.",
  MissingAuthorize:
    "la méthode de connexion est mal configurée. veuillez contacter le support.",
  MissingCSRF:
    "une erreur de sécurité s'est produite. veuillez actualiser la page et réessayer.",
  MissingSecret:
    "une erreur de configuration du serveur s'est produite. veuillez contacter le support.",
  MissingWebAuthnAutocomplete:
    "une erreur de configuration s'est produite avec webauthn. veuillez contacter le support.",
  OAuthAccountNotLinked:
    "si vous voyez cette erreur, c'est que la fusion automatique de comptes n'a pas fonctionné. veuillez contacter le support.",
  OAuthCallbackError:
    "la connexion avec le service externe a échoué. veuillez réessayer ou choisir une autre méthode de connexion.",
  OAuthProfileParseError:
    "nous n'avons pas pu récupérer votre profil depuis le service externe. veuillez réessayer ou contacter le support.",
  OAuthSignInError:
    "un problème est survenu lors du démarrage du processus de connexion. veuillez réessayer ou contacter le support.",
  SessionTokenError:
    "nous n'avons pas pu récupérer les informations de votre session. veuillez vous reconnecter.",
  SignOutError:
    "un problème est survenu lors de votre déconnexion. veuillez réessayer.",
  UnknownAction:
    "cette action n'est pas prise en charge. veuillez vérifier votre demande et réessayer.",
  UnsupportedStrategy:
    "cette méthode de connexion n'est pas prise en charge. veuillez choisir une autre méthode.",
  UntrustedHost:
    "la tentative de connexion provient d'une source non fiable. veuillez vous assurer que vous accédez au site depuis un emplacement sûr.",
  Verification:
    "la vérification a échoué. veuillez vérifier votre email et votre jeton, puis réessayer.",
  WebAuthnVerificationError:
    "la vérification avec webauthn a échoué. veuillez réessayer ou utiliser une autre méthode d'authentification.",
};

export const getError = (errorCode: unknown) => {
  if (errorCode === undefined || errorCode === null) {
    return {
      error: undefined,
      errorMessage: undefined,
    };
  }

  const error = typeof errorCode === "string" ? errorCode : "AuthError";

  const errorMessage =
    AUTH_ERRORS[error] ||
    "une erreur inconnue s'est produite. veuillez réessayer plus tard.";

  return {
    error,
    errorMessage,
  };
};
