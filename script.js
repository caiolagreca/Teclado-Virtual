const Teclado = {

    elementos: {
        principal: null,
        botoesContainer: null,
        botoes: []
    },

    manipuladorEvento: {
        oninput: null,
        onclose: null
    },

    propriedades: {
        value: "",
        capslock: false
    },

    inicia() {
        // Criando elementos principais
        this.elementos.principal = document.createElement('div');
        this.elementos.botoesContainer = document.createElement('div');

        // Inserindo class nos elementos
        this.elementos.principal.classList.add('teclado', 'esconde--teclado');
        this.elementos.botoesContainer.classList.add('teclado__botoes');
        this.elementos.botoesContainer.appendChild(this._criaBotoes());

        this.elementos.botoes = this.elementos.botoesContainer.querySelectorAll('.teclado__botao');

        // Atribuindo hierarquia aos elementos no DOM (Pai e Filho)
        this.elementos.principal.appendChild(this.elementos.botoesContainer);
        document.body.appendChild(this.elementos.principal);

        // Usando teclado automaticamente para os elementos com "teclado-input"
        document.querySelectorAll('.teclado--input').forEach(elemento => {
            elemento.addEventListener('focus', () => {
                this.abre(elemento.value, valorAtual => {
                    elemento.value = valorAtual;
                });
            });
        });
    },

    _criaBotoes() {
        const fragmento = document.createDocumentFragment();
        const layoutBotoes = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Criando HTML para os ícones
        const criaIconeHTML = (icone_nome) => {
            return `<i class='material-icons'>${icone_nome}</i>`;
        };

        layoutBotoes.forEach (botao => {
            const elementoBotao = document.createElement('button');
            const insereQuebraDeLinha = ['backspace', 'p', 'enter', '?'].indexOf(botao) !== -1;

            //Adicionando attributes e clases
            elementoBotao.setAttribute('type', 'button');
            elementoBotao.classList.add('teclado__botao');

            switch (botao) {
                case 'backspace':
                    elementoBotao.classList.add('botao__largo');
                    elementoBotao.innerHTML = criaIconeHTML('backspace');

                    elementoBotao.addEventListener('click', () => {
                        this.propriedades.value = this.propriedades.value.substring(0, this.propriedades.value.length - 1);
                        this._acionaEvento('oninput');
                    });
                    break;

                case 'caps':
                    elementoBotao.classList.add('botao__largo', 'botao__capslock');
                    elementoBotao.innerHTML = criaIconeHTML('keyboard_capslock');

                    elementoBotao.addEventListener('click', () => {
                        this._capslockAtivado();
                        elementoBotao.classList.toggle('botao__capslock--ativo', this.propriedades.capslock);
                    });
                    break;

                case 'enter':
                    elementoBotao.classList.add('botao__largo');
                    elementoBotao.innerHTML = criaIconeHTML('keyboard_return');

                    elementoBotao.addEventListener('click', () => {
                        this.propriedades.value += '\n';
                        this._acionaEvento('oninput');
                    });
                    break;
                
                case 'space':
                    elementoBotao.classList.add('botao__extra__largo');
                    elementoBotao.innerHTML = criaIconeHTML('space_bar');

                    elementoBotao.addEventListener('click', () => {
                        this.propriedades.value += ' ';
                        this._acionaEvento('oninput');
                    });
                    break;

                case 'done':
                    elementoBotao.classList.add('botao__largo', 'botao__check');
                    elementoBotao.innerHTML = criaIconeHTML('check_circle');

                    elementoBotao.addEventListener('click', () => {
                        this.fecha();
                        this._acionaEvento('onclose');
                    });
                    break;

                default:
                    elementoBotao.textContent = botao.toLowerCase();

                    elementoBotao.addEventListener('click', () => {
                        this.propriedades.value += this.propriedades.capslock ? botao.toUpperCase() : botao.toLowerCase();
                        this._acionaEvento('oninput');
                    });
                    break;
            }

            fragmento.appendChild(elementoBotao);

            if (insereQuebraDeLinha) {
                fragmento.appendChild(document.createElement('br'));
            }
        });

        return fragmento;
    },

    _acionaEvento(manipuladorNome) {
        if (typeof this.manipuladorEvento[manipuladorNome] == 'function') {
            this.manipuladorEvento[manipuladorNome](this.propriedades.value);
        }
    },

    _capslockAtivado() {
        this.propriedades.capslock = !this.propriedades.capslock;

        for (const botao of this.elementos.botoes) {
            if (botao.childElementCount === 0) {
                botao.textContent = this.propriedades.capslock ? botao.textContent.toUpperCase() : botao.textContent.toLowerCase();
            }
        }
    },

    abre(valorInicial, oninput, onclose) {
        this.propriedades.value = valorInicial || '';
        this.manipuladorEvento.oninput = oninput;
        this.manipuladorEvento.onclose = onclose;
        this.elementos.principal.classList.remove('esconde--teclado');
    },

    fecha() {
        this.propriedades.value = '';
        this.manipuladorEvento.oninput = oninput;
        this.manipuladorEvento.onclose = onclose;
        this.elementos.principal.classList.add('esconde--teclado');
    }
};

window.addEventListener('DOMContentLoaded', function() {
    Teclado.inicia();
});