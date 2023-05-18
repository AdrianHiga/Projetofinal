const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-ferias');
const sSalario = document.querySelector('#m-retorno');
const btnSalvar = document.querySelector('#btnSalvar');
const btnRelatorio = document.querySelector("#btnRelatorio");

let itens = getItensBD();
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = itens[index].salario;
    id = index;
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td class="list-date">${item.funcao}</td>
    <td class="list-date">${item.salario}</td>
    <td class="acao">
      <button title="Editar" onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button title="Excluir" onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].funcao = sFuncao.value;
    itens[id].salario = sSalario.value;
  } else {
    itens.push({ 'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value });
  }

  setItensBD();

  modal.classList.remove('active');
  loadItens();
  id = undefined;
};

function loadItens() {
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });

  formatDate();
}

function getItensBD() {
  return JSON.parse(localStorage.getItem('dbfunc')) || [];
}

function setItensBD() {
  localStorage.setItem('dbfunc', JSON.stringify(itens));
}

function formatDate() {
  const listDate = document.querySelectorAll('.list-date');

  for (var value of listDate.values()) {
    const date = value.innerHTML.split('-');

    let formatedDate = `${date[2]}/${date[1]}/${date[0]}`;

    value.innerHTML = formatedDate;
  }
}

function gerarRelatorio() {
  const itens = getItensBD();
  let relatorio = "Nome do funcionário\tData de Saída\tData de Retorno\n";

  itens.forEach((item) => {
    relatorio += `${item.nome}\t${item.funcao}\t${item.salario}\n`;
  });

  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(relatorio);
  link.download = "relatorio.txt";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

btnRelatorio.addEventListener("click", gerarRelatorio);

loadItens();
