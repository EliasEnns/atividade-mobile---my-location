# My Location App

## Descrição
My Location App é uma aplicação React Native Expo **completa e funcional**, desenvolvida como um projeto prático para demonstrar a implementação de persistência de dados e gerenciamento de permissões em aplicativos mobile.

A aplicação possui as seguintes funcionalidades:
* **Controle de Tema (Dark Mode):** Um switch que permite alternar entre os temas claro e escuro. A preferência do usuário é salva utilizando `AsyncStorage`, garantindo que o tema escolhido persista entre as sessões do aplicativo.
* **Captura de Localização:** Um botão permite capturar a localização geográfica atual do usuário (latitude e longitude). Antes da captura, o aplicativo solicita as permissões de localização necessárias utilizando `expo-location`.
* **Persistência de Localizações:** Todas as localizações capturadas são salvas e armazenadas em um banco de dados SQLite local, utilizando `expo-sqlite`. Ao iniciar o aplicativo, as localizações previamente salvas são carregadas e exibidas em uma lista.
* **Limpeza de Dados:** Um botão dedicado permite ao usuário limpar todas as localizações armazenadas no banco de dados.
* **Layout Responsivo:** A lista de localizações é configurada para ser scrollável e ocupa de forma otimizada o espaço disponível na tela, proporcionando uma experiência de usuário fluida.

## Funcionalidades Implementadas

Este projeto demonstra a aplicação prática dos seguintes conceitos e tecnologias:

* **`AsyncStorage`:** Para a persistência de preferências de usuário, como o tema da interface (Dark Mode).
* **`expo-location`:** Para a gestão de permissões de localização e a obtenção das coordenadas geográficas do dispositivo.
* **`expo-sqlite`:** Para a criação e interação com um banco de dados SQLite local, persistindo e recuperando os dados de localização.
* **`FlatList`:** Para a exibição eficiente de listas de dados, com funcionalidade de rolagem.

## Instalação

Para rodar este projeto em seu ambiente:

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/EliasEnns/atividade-mobile---my-location](https://github.com/EliasEnns/atividade-mobile---my-location)
    cd atividade-mobile---my-location
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    # yarn install
    ```

3.  **Inicie o projeto Expo:**

    ```bash
    npx expo start
    ```

## Contexto Acadêmico

Este projeto foi desenvolvido como um exemplo prático para as aulas de Solução Mobile do curso de Engenharia de Software e Engenharia da Computação na UniSATC, demonstrando uma aplicação funcional das tecnologias abordadas.