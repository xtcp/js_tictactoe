(function () {
    var state = document.readyState;
    if(state === 'interactive' || state === 'complete') {

        let grille2D = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];
        let divGagne = [];
        let taille = grille2D.length;
        let fini = false, turn = true;
        const message = document.querySelector(".message");
        const bouton = document.querySelector(".recommencer");
        bouton.style.visibility = "hidden";
        const quiGagne = (input) => input === 2 ? 2 : 1; 
        quiJoue();
        function quiJoue() {
            turn = !turn;
            if (turn) {
                message.innerText = "Joeur 2 (X), c'est à toi de jouer!";
            } else {
                message.innerText = "Joeur 1 (O), c'est à toi de jouer!";
            }
        }
        bouton.addEventListener("click", function(e) {
            if (fini) {
                e.target.style.visibility = "hidden";
                fini = false, turn = true;
                grille2D = [[1, 1, 1],[1, 1, 1],[1, 1, 1]];
                divGagne = [];
                quiJoue();
                document.querySelectorAll(".box").forEach(box => {
                    box.innerText = "";
                    box.classList.remove("boxX", "boxO", "box-gagne-ligne", "box-gagne-colonne", "box-gagne-diag1", "box-gagne-diag2", "vert", "rouge");
                });
            }
        });
        document.querySelectorAll(".box").forEach(box => {
            box.addEventListener("click", function(e) {
                if (!fini) {
                    if (grille2D[e.target.dataset.ligne][e.target.dataset.colonne] == 1) {
                        if (turn) {
                            grille2D[e.target.dataset.ligne][e.target.dataset.colonne] = 2;
                            e.target.innerText = "X";
                            e.target.classList.add("boxX");
                        } else {
                            grille2D[e.target.dataset.ligne][e.target.dataset.colonne] = 0;
                            e.target.innerText = "O";
                            e.target.classList.add("boxO");
                        }
                        quiJoue();
                    } else {
                        message.innerHTML += "<p><strong>Choisi une autre case!</strong></p>";
                    }
                    verifierJeu();
                }
            });
        });


        function verifierJeu() {
            // X = 0, O = 2, vide = 1
            // - - - (1 - 1 - 1 ) TOTAL = 3
            // X O - (0 - 2 - 1) TOTAL = 3 
            // - X - (1 - 0 - 1) TOTAL = 2
            // O O O (2 - 2 - 2) TOTAL = 6
            // Si le total = 3 (pas de gagnant)
            // Si le total = 6 (O gagne)
            // Si le total = 0 (X gagne)
            
            
            let verifierDiag1 = true, verifierDiag2 = true;
            let verifierDiag1Prem = grille2D[0][0], verifierDiag2Prem = grille2D[0][grille2D.length-1];
            let totalDiag1 = 0, totalDiag2 = 0;
            // Verifier Ligne et Colonne
            let libre = 0;
            for (let i = 0; i < grille2D.length; i++) {
                let verifierLigne = true, verifierColonne = true;
                let verifierLignePrem = grille2D[i][0], verifierColonnePrem = grille2D[0][i];
                let totalLigne = 0, totalColonne = 0;
                if (verifierDiag1Prem == 1 ) { verifierDiag1 = false; }
                if (verifierDiag2Prem == 1 ) { verifierDiag2 = false; }

                for (let j = 0; j < grille2D[i].length; j++) {
                    if (grille2D[i][j] == 1) { libre++; }
                    if (verifierLignePrem !== 1) {
                        if (verifierLignePrem !== 1 && grille2D[i][j] !== verifierLignePrem) verifierLigne = false;
                    }
                    if  (verifierColonnePrem !== 1) {
                        if (verifierColonnePrem !== 1 && grille2D[j][i] !== verifierColonnePrem) verifierColonne = false;
                    }
                    if (verifierLignePrem == 1 ) { verifierLigne = false; }
                    if (verifierColonnePrem == 1 ) { verifierColonne = false; }

                    
                    totalLigne += grille2D[i][j];
                    totalColonne += grille2D[j][i];

                    if (i == j && verifierDiag1) { // Verifier Diag 1
                        if (grille2D[i][j] !== verifierDiag1Prem) verifierDiag1 = false;
                        totalDiag1 += grille2D[i][j];
                    }
                    if ((i + j === grille2D.length - 1) && verifierDiag2) { // Verifier Diag 2
                        if (grille2D[i][j] !== verifierDiag2Prem) verifierDiag2 = false;
                        totalDiag2 += grille2D[i][j];
                    }
                }

                if (verifierLigne && totalLigne !== 3) {
                    for (let j = 0; j < grille2D[i].length; j++) {
                        divGagne.push([i, j]);
                    }
                    fin(true, quiGagne(verifierLignePrem));
                    return;
                }
                if (verifierColonne && totalColonne !== 3) {
                    for (let j = 0; j < grille2D[i].length; j++) {
                        divGagne.push([j, i]);
                    }
                    fin(true, quiGagne(verifierColonnePrem), "colonne");
                    return;
                }

                // Verifier si le jeu est fini par manque d'espaces libres

            }
            if (libre === 0) {
                fin(false);
                return;
            }
            console.table(grille2D);
            if (verifierDiag1 && totalDiag1 !== 3) {
                for (let i = 0; i < grille2D.length; i++) {
                    divGagne.push([i, i]);
                }
                fin(true, quiGagne(verifierDiag1Prem), "diag1",);
                return;
            }
            if (verifierDiag2 && totalDiag2 !== 3) {
                for (let i = 0; i < grille2D.length; i++) {
                    divGagne.push([i, (grille2D.length - i - 1)]);
                }
                fin(true, quiGagne(verifierDiag2Prem), "diag2");
                return;
            }

        }
        function fin(vainqueur, joeur = 0, type = "ligne") {
            fini = true;
            bouton.style.visibility = "visible";
            if (vainqueur) {
                for (let i = 0; i < divGagne.length; i++) {
                    let div = document.querySelector("div[data-ligne='"+divGagne[i][0]+"'][data-colonne='"+divGagne[i][1]+"']");
                    div.classList.add("box-gagne-"+type);
                    const tempClass = joeur === 2 ?  "vert" : "rouge";
                    div.classList.add(tempClass);
                }
                fini = true;
                console.log("Joeur "+joeur+" a gagné! "+type);
                message.innerText = "Joeur "+joeur+" a gagné!";
                
            } else {
                console.log("Pas de vainqueur!");
                message.innerText = "Pas de vainqueur! Relancez la partie!";
            }
        }
    }
    else setTimeout(arguments.callee, 100);
})();