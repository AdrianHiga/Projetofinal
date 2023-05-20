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

// function deleteItem(index) {
//   itens.splice(index, 1);
//   setItensBD();
//   loadItens();
// }

function deleteItem(index) {
  const confirmDelete = confirm("Tem certeza que deseja excluir este item?");
  if (confirmDelete) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
  }
}


function insertItem(item, index, formattedFuncao, formattedSalario) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td class="list-date">${formattedFuncao}</td>
    <td class="list-date">${formattedSalario}</td>
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
    const formattedFuncao = formatDate(item.funcao);
    const formattedSalario = formatDate(item.salario);
    insertItem(item, index, formattedFuncao, formattedSalario);
  });
}

function getItensBD() {
  let dbfunc = Cookies.get('dbfunc');
  return dbfunc ? JSON.parse(dbfunc) : [];
}

function setItensBD() {
  Cookies.set('dbfunc', JSON.stringify(itens));
}

function formatDate(date) {
  const parts = date.split('-');
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return formattedDate;
}

function gerarRelatorio() {
  let relatorio = `
    <h1 style="text-align: center;">Relatório de Férias</h1><br>
    <table style="margin: 0 auto;">
      <tr>
        <th>Nome do funcionário</th>
        <th>Data de Saída</th>
        <th>Data de Retorno</th>
      </tr>
  `;

  itens.forEach((item) => {
    relatorio += `<tr  style="text-align: center;"><td>${item.nome}</td><td>${formatDate(item.funcao)}</td><td>${formatDate(item.salario)}</td></tr>`;
  });

  relatorio += '</table>';

  // Configurações para gerar o PDF
  const opt = {
    margin: 10,
    filename: 'relatorio.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Gera o PDF a partir do HTML
  html2pdf().set(opt).from(relatorio).save();
}

btnRelatorio.addEventListener("click", gerarRelatorio);

loadItens();
