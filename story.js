/* Images sans texte. Chaque texte devient un élément HTML indépendant.
   audio: null réserve une future piste de voix ; aucun son n'est lancé. */
window.BD_STORY = {
  id: "renaissance-1945-page-01", page: 1, title: "La pierre du ciel",
  panels: [
    {
      id: "peace", title: "La paix retrouvée", shape: "wide",
      image: "illustrations/celebration.webp",
      alt: "En 1945, une foule fête la paix dans une rue illuminée. Un homme lève son chapeau, un marin enlace une femme en rouge et les phares d’une voiture brillent sur les pavés.",
      layers: [
        { id: "peace-caption", kind: "narration", placement: "top-left", text: "2 septembre 1945. Le monde fête la fin de la guerre : on chante, on danse et on s’embrasse dans toutes les rues.", step: 0, audio: null },
        { id: "peace-dialogue", kind: "speech", placement: "peace-bubble", speaker: "Un habitant", text: "C’est fini, mes amis ! La paix est enfin revenue !", step: 1, audio: null }
      ]
    },
    {
      id: "impact", title: "23 h 12 · L’impact", shape: "portrait",
      image: "illustrations/impact.webp",
      alt: "Une météorite incandescente s’écrase dans les montagnes de Blaine County. Une explosion violette éclaire une tour de guet et une route de terre.",
      layers: [
        { id: "impact-caption", kind: "narration", placement: "top-left", text: "23 h 12. Un objet céleste non identifié traverse le ciel avant de s’écraser dans les montagnes de Blaine County.", step: 2, audio: null }
      ]
    },
    {
      id: "crystal", title: "La découverte", shape: "portrait",
      image: "illustrations/crystal.webp",
      alt: "Un grand cristal violet et des éclats lumineux émergent du cratère encore fumant, sous le regard de trois silhouettes minuscules.",
      layers: [
        { id: "crystal-caption", kind: "narration", placement: "top-left", text: "Au milieu de l’impact, des pierres d’une couleur violette vive et éblouissante apparaissent.", step: 3, audio: null }
      ]
    },
    {
      id: "military", title: "Projet Renaissance", shape: "wide",
      image: "illustrations/military.webp",
      alt: "Un officier américain ordonne de boucler le périmètre. Une jeep et des soldats gardent la route qui mène au cratère violet.",
      layers: [
        { id: "military-caption", kind: "narration", placement: "top-right", text: "L’armée arrive avant les secours. Le site est classé « Projet Renaissance ».", step: 4, audio: null },
        { id: "military-dialogue", kind: "speech", placement: "military-bubble", speaker: "L’officier", text: "Bouclez le périmètre ! Personne n’approche, c’est un ordre !", step: 5, audio: null }
      ]
    }
  ]
};

/* Album complet. Modifier ici les textes, les intervenants et les images.
   Les index de lecture sont attribués dans l'ordre des calques de chaque page.
   Les titres des trois voies restent des éléments HTML, jamais des pixels. */
(() => {
  const N = (text, placement = "top-left") => ({kind:"narration", placement, text, audio:null});
  const S = (text, speaker, placement = "story-bubble") => ({kind:"speech", placement, text, speaker, audio:null});
  const P = (id, title, shape, alt, layers, branch) => ({
    id, title, shape, image:`illustrations/${id}.webp`, alt, layers, ...(branch ? {branch} : {})
  });
  const page = (number, title, heading, period, dek, panels) => {
    let step = 0;
    return {
      id:`renaissance-page-${String(number).padStart(2,"0")}`, page:number,
      title, heading, period, dek,
      panels:panels.map(panel => ({...panel,layers:panel.layers.map((layer,i) => ({
        ...layer,id:`${panel.id}-text-${i+1}`,step:step++
      }))}))
    };
  };
  Object.assign(window.BD_STORY, {
    heading:"Le jour où tout a commencé.",
    period:"PROLOGUE · 2 SEPTEMBRE 1945",
    dek:"La paix venait de revenir. Quelque chose d’autre allait arriver."
  });
  window.BD_ALBUM = [
    window.BD_STORY,
    page(2,"Le Bunker 68","Sous la montagne, le silence.","LES EXPÉRIENCES · 1962–1978","La pierre devient un secret d’État. Des vies disparaissent des registres.",[
      P("p02-01","Le complexe militaire","wide","En 1968, des ouvriers et des militaires construisent un bunker dans la montagne. Un camion attend devant l’entrée en béton.",[
        N("12 juillet 1968. En pleine guerre froide, le gouvernement construit un complexe militaire souterrain : le Bunker 68."),
        S("Creusez plus profond. Personne ne doit jamais savoir ce qu’on cache ici.","Un officier")
      ]),
      P("p02-02","La pierre sous observation","portrait","Des scientifiques observent un cristal violet à l’intérieur d’une cuve de verre dans un laboratoire souterrain.",[
        N("Objectif : analyser la pierre de 1945."),
        S("Elle réagit à notre présence… Sa lumière augmente.","Un scientifique")
      ]),
      P("p02-03","Les Enfants de la Lune","portrait","Une infirmière se tient à la porte d’un dortoir d’orphelinat. Un enfant éveillé la regarde, entouré de lits de fer.",[
        N("1962–1978. L’Affaire des Enfants de la Lune. Des orphelinats fictifs sont financés dans le comté pour recueillir des enfants sans famille."),
        S("Dormez bien, mes petits. Demain, le docteur viendra vous voir.","L’infirmière")
      ]),
      P("p02-04","Les registres effacés","wide","Dans un bureau sombre du laboratoire, un médecin et un administrateur examinent des dossiers à la lumière d’une lampe verte.",[
        N("Au Laboratoire Humane, les enfants qui ne survivent pas aux expériences disparaissent des registres."),
        S("Déclarez-le mort de maladie. Personne ne posera de questions.","Un responsable")
      ])
    ]),
    page(3,"Le Directoire","Le prix de l’éternité.","LES CERCLES DU POUVOIR · 1995","Une découverte dans les laboratoires. Un pacte derrière les portes closes.",[
      P("p03-01","Le conseil secret","wide","Une limousine dépose des invités en tenue de soirée devant un club luxueux, au pied des tours de San Andreas.",[
        N("1995. La haute société et le Conseil d’Administration de la ville se réunissent en secret…")
      ]),
      P("p03-02","Le Sérum V-45","portrait","Un chercheur examine une petite fiole de sérum dans un laboratoire aux lumières bleues.",[
        N("…et synthétisent le Sérum V-45 à partir du sang des individus affectés par la pierre."),
        S("Le résultat dépasse toutes nos attentes.","Le chercheur")
      ]),
      P("p03-03","Le pacte","portrait","Stan Cooper préside une réunion discrète dans une salle de conseil en bois sombre, entouré de membres de l’élite.",[
        N("Les recherches se multiplient sur le sérum, mais aucune information publique n’est déclarée."),
        S("Il faut que tout cela reste top secret.","Un membre du conseil")
      ]),
      P("p03-04","Les mêmes visages","wide","Une photographie ancienne montre les mêmes hommes que ceux réunis dans le bureau : leurs visages semblent ne pas avoir vieilli.",[
        N("Le Directoire 1945, mené par Stan Cooper, conserve longévité et pouvoir politique inaltérables. Ses autres membres restent cachés.")
      ])
    ]),
    page(4,"La fracture","Puis la terre s’est ouverte.","LA RUPTURE · 2021–2022","Quatorze heures sans lumière. Un mur pour réponse.",[
      P("p04-01","Le séisme","wide","Des habitants fuient une rue qui s’effondre pendant un séisme. Une voiture bascule dans une fissure sous un ciel orange.",[
        N("14 novembre 2021. Un séisme de magnitude 6,8 réveille la faille du cratère de 1945.","top-right"),
        S("Sortez de là ! Tout s’effondre !","Un habitant","military-bubble")
      ]),
      P("p04-02","Quatorze heures","portrait","Dans une ville plongée dans le noir, la femme au blouson rouge regarde son téléphone. L’homme au bonnet gris allume un briquet.",[
        N("Une impulsion électromagnétique plonge la région dans le noir pendant 14 heures."),
        S("Plus de réseau, plus de lumière… Qu’est-ce qui se passe ?","Une habitante")
      ]),
      P("p04-03","Le Mur","portrait","Des soldats gardent un barrage routier devant un immense mur de béton en construction, au crépuscule.",[
        N("2022. En moins de deux mois, un mur de béton coupe la région en deux."),
        S("Reculez ! Zone interdite !","Un soldat")
      ]),
      P("p04-04","La version officielle","wide","Une présentatrice en veste rouge annonce la quarantaine. Un symbole biologique et des fûts industriels apparaissent derrière elle.",[
        S("Quarantaine biologique de niveau 4, suite à la fragilisation de fûts de déchets toxiques. Restez chez vous.","Narrateur","broadcast-bubble")
      ])
    ]),
    page(5,"Le Sud","Les néons ne disent pas tout.","AU SUD DU MUR","La vie continue en apparence. Les regards, eux, ne vous quittent pas.",[
      P("p05-01","Le rêve américain","wide","Une avenue du Sud sous les néons roses et bleus : voitures de luxe, boutiques, motel et passants sur une chaussée mouillée.",[
        N("Le Sud : l’illusion du rêve américain. Néons, commerces, luxe… mais une atmosphère très lourde pèse sur la ville.")
      ]),
      P("p05-02","Sous surveillance","portrait","Une patrouille de police surveille un passant depuis une voiture garée dans une rue éclairée par les néons.",[
        N("Le LSPD traque en secret les comportements « anormaux »."),
        S("Surveillez celui-là. Il ne réagit pas comme les autres.","Un policier")
      ]),
      P("p05-03","Les fréquences fantômes","portrait","À l’intérieur d’une voiture, une personne encapuchonnée écoute la radio. Des lumières violettes se reflètent sur le pare-brise couvert de pluie.",[
        N("Fréquences fantômes : la nuit, la radio capte des transmissions inhabituelles. Grésillements, mots d’une autre langue, bruits."),
        S("Tu entends ça ? Ce n’est pas une station normale…","La personne à la radio")
      ]),
      P("p05-04","De l’autre côté","wide","Depuis un toit, la femme au blouson rouge regarde la ville et le Mur balayé par des projecteurs.",[
        S("On ne voit jamais ce qu’il y a de l’autre côté…","La femme au blouson rouge","story-bubble")
      ])
    ]),
    page(6,"Le Nord","La terre abandonnée.","AU NORD DU MUR","Ici, les ruines gardent les traces de ceux qu’on a oubliés.",[
      P("p06-01","La zone abandonnée","wide","Trois explorateurs en équipement de protection avancent entre des voitures abandonnées et des immeubles en ruine, au pied du Mur.",[
        N("Le Nord : la terre abandonnée. Pas de flics, pas de lois. Sans combinaison de protection, personne n’ose s’y aventurer.")
      ]),
      P("p06-02","Chacun pour soi","portrait","Un survivant au masque à gaz tend une main pour interdire d’approcher. D’autres habitants se réchauffent autour d’un brasero.",[
        S("Ici, c’est chacun pour soi. Ne t’approche pas de moi sans masque !","Un survivant")
      ]),
      P("p06-03","Les disparus","portrait","Un homme désigne un mur couvert de portraits de personnes disparues dans une ruelle en ruine.",[
        S("Le gouvernement nous cache quelque chose ! Regarde tous ces disparus !","Un habitant du Nord")
      ]),
      P("p06-04","Le froid du cratère","wide","Deux explorateurs masqués examinent un cratère violet. Une vieille voiture et le sol alentour sont couverts de givre.",[
        S("Quelle est cette lueur si intense ? Tu as vu ce froid ?","Un explorateur")
      ])
    ]),
    page(7,"Les Éveillés","Ce que la pierre a réveillé.","L’ANOMALIE","Un don, une expérience, un danger. Les réponses ne se ressemblent pas.",[
      P("p07-01","Le premier signe","wide","La femme aux cheveux bouclés tient un petit cristal violet au-dessus de sa paume, assise devant des documents et une lampe.",[
        N("L’exposition à la pierre de 1945 a réveillé des capacités hors du commun chez certains êtres humains.")
      ]),
      P("p07-02","Des pouvoirs inconnus","portrait","La femme au blouson rouge fait léviter une lourde caisse et des objets, entourés de filaments d’énergie violette.",[
        N("Télékinésie, résistance accrue, perception… et d’autres pouvoirs encore inconnus.")
      ]),
      P("p07-03","La pierre s’intensifie","portrait","Dans un laboratoire de campagne en 1945, des scientifiques et des officiers observent une pierre brillante dans un coffret ouvert.",[
        S("Messieurs, la pierre est de plus en plus lumineuse. Je pense qu’il se passe quelque chose.","Un scientifique")
      ]),
      P("p07-04","Le silence nécessaire","wide","Dans un laboratoire abandonné, l’homme barbu au bonnet gris demande le silence au jeune homme à lunettes en sweat vert.",[
        S("Écoute, fils, tu ne dois absolument parler de ça à personne. Je pense qu’on est en danger.","L’homme au bonnet gris")
      ])
    ]),
    page(8,"L’enquête","Les traces du passé.","LES PREMIÈRES PISTES","Une voix dans la radio. Un nom rayé. Une porte sous la route.",[
      P("p08-01","L’anomalie du quotidien","wide","Les trois enquêteurs écoutent une radio près du Mur : le jeune homme prend des notes, la femme tient le poste et l’homme barbu veille.",[
        N("Étape 1. L’anomalie du quotidien. Une transmission radio a été entendue près du Mur : une langue inconnue, des bruits étranges."),
        S("J’ai l’impression que ce n’est pas humain…","L’un des enquêteurs")
      ]),
      P("p08-02","Le registre oublié","portrait","Sous une ampoule nue, l’homme au bonnet gris pointe une entrée rayée dans un registre ancien.",[
        N("Autre piste : le nom d’un cobaye, retrouvé sur un registre oublié."),
        S("Là, regarde : « CHAKE ». Un nom raturé… un cobaye.","L’homme au bonnet gris")
      ]),
      P("p08-03","Sous la Route 68","portrait","La femme au blouson rouge éclaire une trappe ouverte près d’une route. Une échelle descend vers une lueur violette.",[
        N("Étape 2. Le Bunker de 1968."),
        S("L’entrée doit être par là… sous la Route 68.","La femme au blouson rouge")
      ]),
      P("p08-04","Les cassettes","wide","Dans le bunker, les trois enquêteurs découvrent un magnétophone près d’une lourde porte blindée.",[
        S("Les cassettes de l’époque… elles sont là !","Le jeune homme à lunettes")
      ])
    ]),
    page(9,"Le Dossier Noir","Trois preuves. Un même secret.","LES PREUVES CONTRE LE DIRECTOIRE","Les pièces du dossier se rejoignent. La version officielle se fissure.",[
      P("p09-01","Le dossier rassemblé","wide","Les trois enquêteurs se réunissent autour d’un dossier noir, de photographies, de cassettes et d’une fiole violette.",[
        N("Étape 3. Le Dossier Noir : trois preuves accusent le Directoire.")
      ]),
      P("p09-02","La première preuve","portrait","La femme au blouson rouge lit un registre d’adoption, entourée de l’homme au bonnet et du jeune homme à lunettes.",[
        N("Preuve n° 1 : les registres d’adoption de 1965."),
        S("Tous ces enfants… aucun n’a jamais été adopté.","La femme au blouson rouge")
      ]),
      P("p09-03","La deuxième preuve","portrait","Les enquêteurs fuient un convoi blindé sous la pluie. Une fiole de sérum violet est serrée dans une main gantée.",[
        N("Preuve n° 2 : une fiole du Sérum V-45, dérobée lors d’un convoi sécurisé."),
        S("Une seule fiole… et ils auraient tué pour la récupérer.","L’un des enquêteurs")
      ]),
      P("p09-04","La troisième preuve","wide","Les trois enquêteurs écoutent une cassette, penchés sur un magnétophone, avec des fûts industriels visibles au loin.",[
        N("Preuve n° 3 : l’enregistrement de 2021 qui prouve la fausse quarantaine du Mur."),
        S("Écoutez ça… Ce n’était pas des déchets toxiques.","Le jeune homme à lunettes")
      ])
    ]),
    page(10,"Trois avenirs","À vous de décider.","ÉPILOGUE · LA PRISE DE POUVOIR","Révéler, contrôler ou éveiller. Le Dossier Noir est entre vos mains.",[
      P("p10-01","Le moment du choix","wide","Les trois enquêteurs se tiennent devant une table couverte de preuves, face au dossier noir et à la fiole de sérum.",[
        N("Étape 4. La prise de pouvoir narrative. Votre groupe choisit l’avenir du serveur."),
        S("Le Dossier Noir est complet. À nous de décider.","L’un des enquêteurs")
      ]),
      P("p10-02","Les Révélateurs","third","Le Mur s’effondre et une foule menée par les enquêteurs traverse la brèche sous un ciel orange et violet.",[
        N("Le Mur s’effondre, le gouvernement tombe : la Saison 2 démarre sur une guerre civile.","bottom-caption")
      ],{label:"Les Révélateurs",color:"blue"}),
      P("p10-03","Les Maîtres de l’ombre","third","Dans un bureau au-dessus de la ville, un homme en costume tient le dossier noir, symbole d’un pouvoir secret.",[
        N("Chantage sur le Directoire : monopole des territoires et du marché noir.","bottom-caption")
      ],{label:"Les Maîtres de l’ombre",color:"red"}),
      P("p10-04","Les Éveillés","third","La femme au blouson rouge regarde un immense cristal violet en lévitation. Des débris flottent dans l’air.",[
        N("Les artefacts débloquent l’anomalie. De grands pouvoirs impliquent de grandes responsabilités.","bottom-caption")
      ],{label:"Les Éveillés",color:"purple"})
    ])
  ];
})();
