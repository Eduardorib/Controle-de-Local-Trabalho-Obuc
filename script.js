class InfoUser {
  constructor(predio, localDeTrabalho) {
    this.predio = predio;
    this.localDeTrabalho = localDeTrabalho;
  }

  validateInfoUser() {
    if (this.predio != "" && this.localDeTrabalho != "") {
      return true;
    }

    return false;
  }
}

class StorageInfoUser {
  constructor() {
    let arrLocaisTrabalho = Array();
    arrLocaisTrabalho = sessionStorage.getItem("infoArray");

    if (arrLocaisTrabalho == null) {
      arrLocaisTrabalho = sessionStorage.setItem("infoArray", []);
    }
  }

  // Forçar um array vazio no session storage
  emptyArray() {
    let arrLocaisTrabalho = [];

    arrLocaisTrabalho = sessionStorage.getItem("infoArray");

    if (arrLocaisTrabalho === undefined || arrLocaisTrabalho === null || arrLocaisTrabalho.length === 0) {
      arrLocaisTrabalho = [];
      sessionStorage.setItem("infoArray", JSON.stringify(arrLocaisTrabalho));
    }
  }

  // Retornar o array do sessionStorage
  getArray() {
    let arrLocaisTrabalho = [];
    arrLocaisTrabalho = JSON.parse(sessionStorage.getItem("infoArray"));
    if (arrLocaisTrabalho == "") {
      arrLocaisTrabalho = [];
    }
    return arrLocaisTrabalho;
  }

  // Inserir um elemento no sessionStorage
  setInfo(info) {
    let arrLocaisTrabalho = [];
    arrLocaisTrabalho = this.getArray();
    arrLocaisTrabalho.push(info);
    sessionStorage.setItem("infoArray", JSON.stringify(arrLocaisTrabalho));
  }

  // Deletar um elemento do sessionStorage
  delete(id) {
    let arrLocaisTrabalho = [];
    arrLocaisTrabalho = JSON.parse(sessionStorage.getItem("infoArray"));

    let arrayAux = [];
    arrayAux = arrLocaisTrabalho.filter((value, index) => index != id);
    sessionStorage.setItem("infoArray", JSON.stringify(arrayAux));
  }

  // Editar um elemento
  edit(id, info) {
    let arrLocaisTrabalho = [];
    arrLocaisTrabalho = this.getArray();
    arrLocaisTrabalho[id] = info;
    sessionStorage.setItem(`infoArray`, JSON.stringify(arrLocaisTrabalho));
  }

  // Retornar por ID
  getWithId(id) {
    let arrLocaisTrabalho = [];
    arrLocaisTrabalho = JSON.parse(sessionStorage.getItem("infoArray"));
    return arrLocaisTrabalho[id];
  }
}

let StorageInfo = new StorageInfoUser();


function closeModal() {
  let modal = document.getElementById('modal');
  let overlay = document.getElementById('overlay');

  modal.className = ''
  overlay.className = ''
}


// Inserir os devidos elementos do SessionStorage na Tabela

function populateTable(infos = "") {
  StorageInfo.emptyArray();

  if (infos == "") {
    infos = StorageInfo.getArray();
  }

  let table_info = document.getElementById("table_info");
  table_info.innerHTML = "";

  infos.forEach(function (info, id) {
    let row = table_info.insertRow();

    row.id = `row_${id}`;
    row.insertCell(0).innerHTML = info.predio;
    row.insertCell(1).innerHTML = info.localDeTrabalho;
    row.insertCell(2).innerHTML = `<i class="fas fa-pen" onClick="editInfo(${id})"> </i> 
                                   <i class="fas fa-trash" onClick="deleteInfo(${id})"> </i>`;
  });
}


/* Adicionar um elemento na tabela */

function addInfo(id = -1) {
  let aux = id;
  if (id == -1) aux = "";
  let predio = document.getElementById(`predio_${aux}`).value;
  let local = document.getElementById(`localTrabalho_${aux}`).value;

  let infoUser = new InfoUser(predio, local);

  if(id < 0) {
    let predioRequired = document.getElementById("predio-required");
    let localDeTrabalhoRequired = document.getElementById("localDeTrabalho-required");

    if (infoUser.predio == "") {
      predioRequired.className = "required";
    } else {
      predioRequired.className = "non-required";
    }

    if (infoUser.localDeTrabalho == "") {
      localDeTrabalhoRequired.className = "required";
    } else {
      localDeTrabalhoRequired.className = "non-required";
    }
  }

  if (id >= 0 && infoUser.validateInfoUser()) {
    StorageInfo.emptyArray();
    StorageInfo.edit(id, infoUser);

  } else if (infoUser.validateInfoUser()) {
    StorageInfo.emptyArray();
    StorageInfo.setInfo(infoUser);
  } 

}

/* Deletar um elemento da tabela */

function deleteInfo(id) {

  let modal = document.getElementById('modal');
  let confirmButton = document.getElementById('confirm')
  let cancelButton = document.getElementById('cancel');
  let closeButton = document.getElementById('close-button');
  let overlay = document.getElementById('overlay');

  overlay.className = 'active';
  modal.className = 'active';

  confirmButton.onclick = () => {
    closeModal();
    StorageInfo.delete(id);
    populateTable();
  }

  cancelButton.onclick = () => {
    closeModal();
  }

  closeButton.onclick = () => {
    closeModal();
  }
}

/* Editar um elemento da tabela */

function editInfo(id) {
  let info = StorageInfo.getWithId(id);
  let row = document.getElementById(`row_${id}`);
  row.innerHTML = "";

  let select = document.createElement("select");
  let option1 = document.createElement("option");
  option1.value = "Prédio 1";
  option1.innerText = "Prédio 1";

  let option2 = document.createElement("option");
  option2.value = "Prédio 2";
  option2.innerText = "Prédio 2";

  let option3 = document.createElement("option");
  option3.value = "Prédio 3";
  option3.innerText = "Prédio 3";

  select.add(option1);
  select.add(option2);
  select.add(option3);

  select.id = `predio_${id}`;
  select.value = `${info.predio}`;

  row.insertCell(0).appendChild(select);
  row.insertCell(1).innerHTML = `<input type="text" id="localTrabalho_${id}" name="localTrabalho_${id} value="${info.localDeTrabalho}">`;
  row.insertCell(2).innerHTML = `<i class="fas fa-check-circle" onclick="saveEdit(${id})"></i>
                                 <i class="fas fa-times-circle" onclick="populateTable()"></i>`;
 
}

function saveEdit(id) {
    addInfo(id);
    populateTable();
}

/* Procurar por Local de Trabalho na tabela */

function searchInfo() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


/* Ordenação por ordem alfabética da tabela */

th = document.getElementsByTagName("th");

for (let id = 0; id < th.length; id++) {
  th[id].addEventListener("click", info(id));
}

function info(id) {
  return function () {
    sortTable(id);
  };
}

function sortTable(id) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[id];
      y = rows[i + 1].getElementsByTagName("td")[id];

      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

/* Ativação da Search bar */

  let button = document.getElementById('activate-search');
  let div = document.getElementById('search');

  button.onclick = () => {
    if(div.className == ''){
    div.className = 'active';
    } 
    else {
    div.className = '';
    }
  }

