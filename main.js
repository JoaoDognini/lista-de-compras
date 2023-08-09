let listaDeItens = [];
let itemEditar;
const form = document.getElementById('form-itens');
const itensInput = document.getElementById('receber-item');
const ulItens = document.getElementById('lista-de-itens');
const ulComprados = document.getElementById('itens-comprados');
const listaRecuperada = localStorage.getItem('listaDeItens');

if (listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada);
    mostrarItem();
} else listaDeItens = [];

form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    salvarItem();
    mostrarItem();
    itensInput.value = '';
});

function salvarItem() {
    const comprasItem = itensInput.value;
    const confereRepetido = listaDeItens.some(item => item.valor.toUpperCase() == comprasItem.toUpperCase());

    confereRepetido ? alert('Item já existe') : listaDeItens.push({ valor: comprasItem });
}

function mostrarItem() {
    ulItens.innerHTML = '';
    ulComprados.innerHTML = '';    

    listaDeItens.forEach((item, index) => {        
        if (item.checar) {            
            ulComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" checked class="is-clickable" />  
                    <span class="itens-comprados is-size-5" ${index !== Number(itemEditar) ? 'disabled' : ''}>${item.valor}</span>
                </div>
                <div>
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        } else {            
            ulItens.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" class="is-clickable" />
                <input type="text" class="is-size-5" value="${item.valor}" ${index !== Number(itemEditar) ? 'disabled' : ''}></input>
            </div>

            <div>
                ${index === Number(itemEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `
        }
    })

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]');
    inputsCheck.forEach(input => {
        input.addEventListener('click', (evento) => {            
            const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens[valorElemento].checar = evento.target.checked;
            mostrarItem();
        })
    })

    const deletaItem = document.querySelectorAll('.deletar');
    deletaItem.forEach(deletar => {
        deletar.addEventListener('click', (evento) => {            
            const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens.splice(valorElemento, 1);
            mostrarItem();
        })
    })

    const editarItens = document.querySelectorAll('.editar');
    editarItens.forEach(editar => {
        editar.addEventListener('click', (evento) => {            
            itemEditar = evento.target.parentElement.parentElement.getAttribute('data-value');
            mostrarItem();
        })
    })

    atualizaLocalStorage();
}

function salvarEdicao() {    
    const itemEditado = document.querySelector(`[data-value="${itemEditar}"] input[type="text"]`);
    listaDeItens[itemEditar].valor = itemEditado.value;
    itemEditar = -1;
    mostrarItem();
}

function atualizaLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}