export default {
  auth: {
    login: {
      title: 'Acessar',
      fields: {
        email: 'Email',
        password: 'Senha',
      },
      actions: {
        login: 'Acessar',
      },
      messages: {
        userNotFound: 'Não foi encontrado um cadastro com o email informado.',
        wrongPassword: 'A senha informada está incorreta.',
      },
      rules: {
        invalidEmail: 'Email inválido',
        passwordMinimumSize: 'É necessário no mínimo 6 caracteres',
      },
      descriptions: {
        signIn: 'Ou acesse usando:',
      },
    },
    register: {
      title: 'Cadastrar',
      messages: {
        emailAlreadyInUse: 'Já existe um cadastro com o email informado.',
      },
      fields: {
        email: 'Email',
        password: 'Senha',
      },
      actions: {
        login: 'Cadastrar',
      },
      rules: {
        invalidEmail: 'Email inválido',
        passwordMinimumSize: 'É necessário no mínimo 6 caracteres',
      },
      descriptions: {
        signIn: 'Ou cadastre-se usando:',
      },
    },
  },
  boardColumn: {
    actions: {
      deleteColumn: 'Excluir coluna',
      newTask: 'Nova tarefa',
    },
    messages: {
      newTaskLimit: 'A quantidade máxima de tarefas por coluna é 5.',
    },
  },
  boardColumnList: {
    actions: {
      addNewColumn: 'Nova coluna',
      clickToUpdate: 'Clique para alterar',
    },
  },
  projectManagerModal: {
    fields: {
      name: 'Nome',
      description: 'Descrição',
      responsible: 'Responsável',
    },
    rules: {
      requiredField: 'Campo obrigatório',
    },
    newProject: 'Criar projeto',
    updateProject: 'Alterar projeto',
  },
  projectsList: {
    table: {
      noDataLabel: 'Nenhum projeto cadastrado',
      noResultsLabel: 'Nenhum projeto encontrado com o filtro informado',
      columns: {
        name: 'Nome',
        description: 'Descrição',
        responsible: 'Responsável',
        column: 'Colunas',
        tasks: 'Tarefas',
        actions: 'Ações',
      },
    },
    fields: {
      search: 'Pesquisar',
    },
    actions: {
      newProject: 'Criar projeto',
      updateProject: 'Alterar projeto',
      redirectToProject: 'Acessar projeto',
      deleteProject: 'Excluir projeto',
    },
    messages: {
      projectsLimit: 'A quantidade máxima de projetos é 10.',
    },
  },
  taskCard: {
    assignee: 'Tarefa atribuída para: {0}',
    emptyAssignee: 'Não atribuído',
    actions: {
      updateTask: 'Alterar tarefa',
      deleteTask: 'Excluir tarefa',
    },
  },
  taskManagerModal: {
    fields: {
      title: 'Título',
      assignee: 'Responsável',
    },
    newTask: 'Criar tarefa',
    updateTask: 'Alterar tarefa',
    rules: {
      requiredField: 'Campo obrigatório',
    },
  },
  general: {
    close: 'Fechar',
    return: 'Voltar',
    disconnect: 'Desconectar',
  },
};
