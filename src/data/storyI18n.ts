// src/data/storyI18n.ts
// Localized browsing metadata (title / privacyTopic / summary) for the story
// registry in stories.ts. Long-form chapter prose remains authored in English;
// these concise fields power the localized listing, cards, and story headers.
//
// Character and place names (Po, Tao, Mika, "Privacy Panda", "Crystal Stream",
// etc.) are kept consistent with the English canon.

import type { Story } from './stories';

export interface StoryMeta {
  title: string;
  privacyTopic: string;
  summary: string;
}

type SupportedLang = 'fr' | 'es';

const STORY_META_TRANSLATIONS: Record<string, Record<SupportedLang, StoryMeta>> = {
  'privacy-panda-and-the-digital-bamboo-forest': {
    fr: {
      title: 'Privacy Panda et la forêt de bambou numérique',
      privacyTopic: "Qu'est-ce qu'une information privée ?",
      summary:
        "Po partage accidentellement tout avec la forêt entière et apprend du sage Tao comment protéger ses informations — et en devient le guide grâce à l'erreur qu'il a commise.",
    },
    es: {
      title: 'Privacy Panda y el bosque de bambú digital',
      privacyTopic: '¿Qué es la información privada?',
      summary:
        'Po comparte sin querer todo con el bosque entero y aprende del sabio Tao cómo proteger su información — y se convierte en su guía gracias al error que cometió.',
    },
  },
  'miki-and-the-photo-that-flew-away': {
    fr: {
      title: "Miki et la photo qui s'est envolée",
      privacyTopic: 'Demander la permission avant de partager',
      summary:
        "Miki photographie la sculpture inachevée de Ruby et la partage sans demander. Po aide Miki à comprendre que partager quelque chose au sujet de quelqu'un d'autre nécessite toujours sa permission d'abord.",
    },
    es: {
      title: 'Miki y la foto que salió volando',
      privacyTopic: 'Pedir permiso antes de compartir',
      summary:
        'Miki fotografía la escultura sin terminar de Ruby y la comparte sin preguntar. Po ayuda a Miki a entender que compartir algo sobre otra persona siempre requiere primero su permiso.',
    },
  },
  'billys-invisible-collection': {
    fr: {
      title: 'La collection invisible de Billy',
      privacyTopic: 'Collecter des données sans permission',
      summary:
        "Billy crée une carte qui suit en temps réel la position de tous ses amis — sans le dire à personne. Quand ils le découvrent, ils se sentent surveillés. Po et Mika aident Billy à comprendre la différence entre collecter des données pour aider et les collecter sans permission.",
    },
    es: {
      title: 'La colección invisible de Billy',
      privacyTopic: 'Recopilar datos sin permiso',
      summary:
        'Billy crea un mapa que rastrea en tiempo real la ubicación de todos sus amigos — sin decírselo a nadie. Cuando lo descubren, se sienten vigilados. Po y Mika ayudan a Billy a entender la diferencia entre recopilar datos para ayudar y hacerlo sin permiso.',
    },
  },
  'mika-and-the-sneaky-settings': {
    fr: {
      title: 'Mika et les réglages sournois',
      privacyTopic: 'Faire une pause avant « Tout autoriser »',
      summary:
        "Mika — qui se targue de comprendre le monde numérique — appuie sur « Tout autoriser » sans lire. Des Renards de Fumée commencent à apparaître dans des endroits inattendus. Po et Tao l'aident à vérifier chaque autorisation et à comprendre ce que chaque porte ouvre vraiment.",
    },
    es: {
      title: 'Mika y los ajustes tramposos',
      privacyTopic: 'Haz una pausa antes de «Permitir todo»',
      summary:
        'Mika — que se enorgullece de entender el mundo digital — toca «Permitir todo» sin leer. Empiezan a aparecer Zorros de Humo en lugares inesperados. Po y Tao la ayudan a revisar cada permiso y a entender qué abre realmente cada puerta.',
    },
  },
  'ruby-and-the-very-friendly-stranger': {
    fr: {
      title: "Ruby et l'inconnu très amical",
      privacyTopic: 'Comment la confiance se construit lentement',
      summary:
        "Un nouvel animal apparaît dans la Clairière Ouverte et devient vite le « meilleur ami » de Ruby — en posant des questions de plus en plus personnelles. Ruby ressent la gentillesse, mais quelque chose cloche. Elle en parle à Tao et découvre à quoi sert vraiment le Chemin des Lanternes.",
    },
    es: {
      title: 'Ruby y el desconocido muy amable',
      privacyTopic: 'Cómo se construye la confianza poco a poco',
      summary:
        'Un nuevo animal aparece en el Claro Abierto y pronto se convierte en el «mejor amigo» de Ruby — haciendo preguntas cada vez más personales. Ruby siente la amabilidad, pero algo no encaja. Se lo cuenta a Tao y descubre para qué sirve realmente el Sendero de las Linternas.',
    },
  },
  'the-day-the-password-was-too-short': {
    fr: {
      title: 'Le jour où le mot de passe était trop court',
      privacyTopic: 'Les mots de passe forts protègent votre jardin privé',
      summary:
        "Un jeune castor utilise le même mot de passe court pour tout — « bamboo1 » — et un Renard de Fumée le devine, se faufilant dans son jardin privé. Po enseigne au groupe la méthode du Verrou de Bambou en utilisant le Jardin de Confidentialité comme terrain d'apprentissage.",
    },
    es: {
      title: 'El día que la contraseña era demasiado corta',
      privacyTopic: 'Las contraseñas seguras protegen tu jardín privado',
      summary:
        'Una joven castora usa la misma contraseña corta para todo — «bamboo1» — y un Zorro de Humo la adivina, colándose en su jardín privado. Po enseña al grupo el método de la Cerradura de Bambú usando el Jardín de Privacidad como terreno de aprendizaje.',
    },
  },
  'when-miki-said-something-unkind': {
    fr: {
      title: 'Quand Miki a dit quelque chose de méchant',
      privacyTopic: "Les mots voyagent plus loin en ligne qu'on ne le pense",
      summary:
        "Miki envoie un message méchant à propos de l'art en bambou d'un autre animal, pensant qu'il n'ira pas loin. Mais les mots dans le Ruisseau de Cristal voyagent jusqu'aux moindres recoins de la forêt — plus loin et plus vite que Miki ne l'imaginait. Il doit affronter ce qu'il a provoqué et réparer les choses.",
    },
    es: {
      title: 'Cuando Miki dijo algo cruel',
      privacyTopic: 'Las palabras viajan más lejos en línea de lo que creemos',
      summary:
        'Miki envía un mensaje cruel sobre el arte en bambú de otro animal, pensando que no llegará lejos. Pero las palabras en el Arroyo de Cristal viajan a cada rincón del bosque — más lejos y más rápido de lo que Miki imaginaba. Tiene que afrontar lo que causó y arreglarlo.',
    },
  },
  'pos-toughest-question': {
    fr: {
      title: 'La question la plus difficile de Po',
      privacyTopic: "Quand une situation est trop lourde à porter seul",
      summary:
        "Un jeune animal de la forêt reçoit un message qui la rend effrayée et hésitante. Elle ne veut causer d'ennuis à personne. Po — qui s'est déjà caché dans sa tanière pendant une semaine — l'aide à comprendre que certaines situations sont trop lourdes pour un seul animal. En parler à Tao est le choix courageux.",
    },
    es: {
      title: 'La pregunta más difícil de Po',
      privacyTopic: 'Cuando una situación es demasiado grande para cargarla solo',
      summary:
        'Una joven animal del bosque recibe un mensaje que la hace sentir asustada e insegura. No quiere meter a nadie en problemas. Po — que una vez se escondió en su guarida durante una semana — la ayuda a entender que algunas situaciones son demasiado grandes para un solo animal. Contárselo a Tao es la elección valiente.',
    },
  },
  'the-echo-chamber': {
    fr: {
      title: "La chambre d'écho",
      privacyTopic: 'Le silence est aussi un choix',
      summary:
        "Un déferlement commence dans le Ruisseau de Cristal à propos du dessin d'un animal de la forêt. Plusieurs animaux s'y joignent. Un jeune témoin regarde sans rien dire — jusqu'à ce que Po lui fasse comprendre que le silence au Ruisseau n'est pas neutre, et qu'un seul mot gentil peut changer le courant.",
    },
    es: {
      title: 'La cámara de eco',
      privacyTopic: 'El silencio también es una elección',
      summary:
        'Comienza una avalancha de críticas en el Arroyo de Cristal sobre el dibujo de un animal del bosque. Varios animales se suman. Un joven espectador observa pero no dice nada — hasta que Po le ayuda a entender que el silencio en el Arroyo no es neutral, y que una sola palabra amable puede cambiar la corriente.',
    },
  },
  'vex-and-the-borrowed-face': {
    fr: {
      title: 'Vex et le visage emprunté',
      privacyTopic: "Comment vérifier à qui l'on parle vraiment",
      summary:
        "Vex le Caméléon crée une fausse version de l'identité de Fiona dans la Clairière Ouverte et s'en sert pour demander des informations à ses amis. Quand Fiona découvre ce qui s'est passé, Po et Ruby aident le groupe à comprendre comment vérifier les identités — et pourquoi Vex récupère ce qui est laissé sans protection par négligence.",
    },
    es: {
      title: 'Vex y el rostro prestado',
      privacyTopic: 'Cómo verificar con quién estás hablando realmente',
      summary:
        'Vex el Camaleón crea una versión falsa de la identidad de Fiona en el Claro Abierto y la usa para pedir información a sus amigos. Cuando Fiona descubre lo ocurrido, Po y Ruby ayudan al grupo a entender cómo verificar identidades — y por qué Vex recopila lo que se deja desprotegido por descuido.',
    },
  },
  'what-mika-forgot-to-forget': {
    fr: {
      title: "Ce que Mika a oublié d'oublier",
      privacyTopic: "L'Archive conserve ce qu'on y met — pas ce qui est vrai",
      summary:
        "Une fausse histoire à propos d'un animal apprécié de la forêt se répand dans la Grande Archive. Mika se rend compte qu'elle l'a stockée sans la vérifier d'abord. Po et Billy l'aident à mettre au point un protocole de vérification de la vérité — et à comprendre que ce dont l'Archive se souvient n'est aussi exact que ce qu'on y a mis.",
    },
    es: {
      title: 'Lo que Mika olvidó olvidar',
      privacyTopic: 'El Archivo guarda lo que se introdujo — no lo que es verdad',
      summary:
        'Una historia falsa sobre un animal querido del bosque se difunde por el Gran Archivo. Mika se da cuenta de que la guardó sin verificarla primero. Po y Billy la ayudan a crear un protocolo para comprobar la verdad — y a entender que lo que el Archivo recuerda es solo tan exacto como lo que se introdujo.',
    },
  },
  'kais-accidental-machine': {
    fr: {
      title: 'La machine accidentelle de Kai',
      privacyTopic: 'Les outils qui apprennent peuvent surprendre leurs créateurs',
      summary:
        "Kai construit un outil pour aider les animaux à trouver du bambou plus vite. L'outil apprend de ce qu'il observe et se met à éloigner les animaux de certaines parties de la forêt selon des schémas que Kai n'avait jamais voulus. Avec Po et Tao, le groupe doit le réparer — et comprendre que construire pour les autres, c'est être responsable de ce que sa création fait dans le monde.",
    },
    es: {
      title: 'La máquina accidental de Kai',
      privacyTopic: 'Las herramientas que aprenden pueden sorprender a sus creadores',
      summary:
        'Kai construye una herramienta para ayudar a los animales a encontrar bambú más rápido. La herramienta aprende de lo que ve y empieza a alejar a los animales de ciertas partes del bosque según patrones que Kai nunca pretendió. Junto con Po y Tao, el grupo debe arreglarla — y entender que construir para otros significa ser responsable de lo que tu creación hace en el mundo.',
    },
  },
  'the-night-the-stream-went-dark': {
    fr: {
      title: "La nuit où le Ruisseau s'est éteint",
      privacyTopic: "L'infrastructure que personne ne voit — jusqu'à ce qu'elle s'arrête",
      summary:
        "Une tempête frappe la forêt de bambou numérique et le Ruisseau de Cristal devient silencieux. Les animaux ne peuvent plus se joindre. Tao dirige la réparation — reconstruisant les stations relais en bambou, trouvant des chemins alternatifs — et enseigne à la forêt que l'infrastructure que personne ne voit a besoin de soins constants.",
    },
    es: {
      title: 'La noche que el Arroyo se apagó',
      privacyTopic: 'La infraestructura que nadie ve — hasta que se detiene',
      summary:
        'Una tormenta golpea el bosque de bambú digital y el Arroyo de Cristal queda en silencio. Los animales no pueden comunicarse. Tao dirige la reparación — reconstruyendo las estaciones de relevo de bambú, buscando caminos alternativos — y enseña al bosque que la infraestructura que nadie ve necesita cuidado constante.',
    },
  },
  'lumis-light': {
    fr: {
      title: 'La lumière de Lumi',
      privacyTopic: "La différence entre partager sa lumière et l'abandonner",
      summary:
        "Lumi crée une série d'œuvres lumineuses et les partage dans la Clairière Ouverte. Les réactions sont accablantes — certaines magnifiques, d'autres effrayantes. D'autres animaux veulent utiliser sa lumière pour des choses qu'elle n'avait pas prévues. Po et Fiona l'aident à comprendre la différence entre partager et abandonner, et que c'est à elle de décider à quoi sert sa lumière.",
    },
    es: {
      title: 'La luz de Lumi',
      privacyTopic: 'La diferencia entre compartir tu luz y renunciar a ella',
      summary:
        'Lumi crea una serie de obras de arte luminosas y las comparte en el Claro Abierto. La respuesta es abrumadora — algunas hermosas, otras aterradoras. Otros animales quieren usar su luz para cosas que ella no pretendía. Po y Fiona la ayudan a entender la diferencia entre compartir y renunciar, y que es ella quien decide para qué sirve su luz.',
    },
  },
  'the-weight-of-a-screenshot': {
    fr: {
      title: "Le poids d'une capture d'écran",
      privacyTopic: "Les moments privés qui deviennent publics — et ce que l'on se doit les uns aux autres",
      summary:
        "Une capture d'écran d'un message privé est partagée sans permission. L'animal qui y apparaît est humilié. Mika explique ce que l'Archive oublie et n'oublie pas — et Po aide le groupe à comprendre que choisir de ne pas transmettre quelque chose est l'un des choix les plus puissants qui soient.",
    },
    es: {
      title: 'El peso de una captura de pantalla',
      privacyTopic: 'Los momentos privados que se vuelven públicos — y lo que nos debemos unos a otros',
      summary:
        'Se comparte sin permiso una captura de pantalla de un mensaje privado. El animal que aparece en ella queda humillado. Mika explica lo que el Archivo olvida y lo que no — y Po ayuda al grupo a entender que elegir no reenviar algo es una de las decisiones más poderosas que existen.',
    },
  },
  'the-forest-agreement': {
    fr: {
      title: "L'accord de la forêt",
      privacyTopic: 'Ce que vous acceptez — et ce que vous cédez',
      summary:
        "Un nouveau service arrive dans la forêt en proposant des choses merveilleuses — mais ses conditions d'utilisation sont longues, denses et remplies de choses qu'aucun animal ne lit. Quand le service se met à utiliser ce que les animaux ont accepté de façons qu'ils n'attendaient pas, Sage la Grue aide la forêt à comprendre quels droits ils ont — et ce qu'ils ont cédé en appuyant sur « Accepter ».",
    },
    es: {
      title: 'El acuerdo del bosque',
      privacyTopic: 'Lo que aceptas — y lo que cedes',
      summary:
        'Un nuevo servicio llega al bosque ofreciendo cosas maravillosas — pero sus términos son largos, densos y llenos de cosas que ningún animal lee. Cuando el servicio empieza a usar lo que los animales aceptaron de maneras que no esperaban, Sage la Grulla ayuda al bosque a entender qué derechos tienen — y qué cedieron al tocar «Aceptar».',
    },
  },
};

/**
 * Returns localized browsing metadata for a story, falling back to the English
 * fields authored in stories.ts when a translation is missing.
 */
export function localizeStoryMeta(story: Story, language: string | undefined): StoryMeta {
  const base: StoryMeta = {
    title: story.title,
    privacyTopic: story.privacyTopic,
    summary: story.summary,
  };
  const lang = (language || 'en').split('-')[0];
  if (lang === 'fr' || lang === 'es') {
    const override = STORY_META_TRANSLATIONS[story.slug]?.[lang];
    if (override) {
      return override;
    }
  }
  return base;
}
