const usuarios = JSON.parse(localStorage.getItem('Usuarios')) || [];

const listaTarefas = document.getElementById('listaTarefas')
const criarTarefas = document.getElementById('tarefasEL');

const nomeTarefa = document.getElementById("nomeTarefa");
const descricaoTarefa = document.getElementById("descricaoTarefa")
const salvarTarefa = document.getElementById('salvarTarefa')



function login() {
  const loginUsuario = {
    user: document.getElementById("userLogin").value,
    senha: document.getElementById("senhaLogin").value,
  }
  for (let usuario of usuarios) {
    if (loginUsuario.user === usuario.user && loginUsuario.senha === usuario.senha) {
      window.location.href = './userArea.html';
      return;
    }
  }
  alert('Usuário/senha Incorretos ou Inexistentes')
  return;
};


function cadastrar() {
  const loginUsuario = {
    user: document.getElementById("userUsuario").value,
    senha: document.getElementById("senhaUsuario").value,
  };
  for (let usuario of usuarios) {
    if (loginUsuario.user === usuario.user) {
      alert("Ops, esse usuário já existe!");
      return;
    }
  }
  usuarios.push(loginUsuario);
  localStorage.setItem('Usuarios', JSON.stringify(usuarios));
  alert("Cadastrado com sucesso!");
  window.location.href = './loginArea.html';
};




axios.defaults.baseURL = 'https://afazer-beta-ver10.herokuapp.com/';

axios.get('/tarefas')
        .then(response => {
            response.data.forEach(item => {
                listaTarefas.innerHTML += `${item.nome} <br/>`
            });
        })
        .catch(error => console.log(error));

let tarefas = [];

document
  .getElementById("formTarefas")
  .addEventListener("submit", addTarefa);

async function addTarefa(e) {
  e.preventDefault();

  const id = document.getElementById('idTarefa');
  const nomeTarefa = document.getElementById('nomeTarefa');
  const descricaoTarefa = document.getElementById('descricaoTarefa');

  const tarefaV = {
    nomeTarefa: nomeTarefa.value,
    descricaoTarefa: descricaoTarefa.value,
  }

  try {
    if (!id.value) {
      await axios.post("/tarefas", tarefaV);
    } else {
      await axios.put(`/tarefas/${id.value}`, tarefaV);
    }
  } catch (error) {
    console.error('Erro de Requisição: ', error);
  }

  listarTarefas();
  id.value = "";
  nomeTarefa.value = "";
  descricaoTarefa.value = "";
}

async function listarTarefas() {
  
  try {
    let response = await axios.get('/tarefas');
  
    if (!response.data.length) {
      return;
    }
    
    tarefas = response.data;

    exibirTarefas();


  } catch (error) {
    console.error('Erro de Requisição: ', error)
  }
}


function exibirTarefas() {

  listaTarefas.innerHTML = ""

  for (item of tarefas) {

    const pos = tarefas.indexOf(item)

    listaTarefas.insertAdjacentHTML("afterbegin",
    `<div class="row chores">
        <div class="col-md-3">
        <input id="idTarefa" type="hidden" value="" />
        </div>
        <div class="col-md-3">${item.nome}</div>
        <div class="col-md-3">${item.descricao}</div>
        <div class="col-md-3">
          <button button class="btn-editar" onclick="editarTarefa(${pos})"> Editar </button>
          <button class="btn-remover" onclick="removerTarefa(${pos})"> Remover </button>
        </div>
    </div>`);
  }
  return;
}


exibirTarefas()
salvarTarefa.setAttribute('onclick', 'addTarefa()')

async function removerTarefa(idDeletar) {
  try {
    const response = await axios.delete(`/tarefas/`, {
      data: { id: idDeletar }
    }) ;
  
    if (response.status != 204) {
      return
    }
  
    const index = tarefas.findIndex((recado) => idDeletar == tarefa.id);
      tarefas.splice(index, 1);
  
      exibirTarefas();
  
    } catch (error) {
    console.error(error)
    }
  }
