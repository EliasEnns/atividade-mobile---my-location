import * as SQLite from 'expo-sqlite';

console.log('database.js: Inicializando módulo SQLite.');

let db = null; // Declare db como null inicialmente

// Use uma função assíncrona para abrir o banco de dados
async function getDb() {
  if (db) { // Se o banco já estiver aberto, retorne-o
    console.log('database.js: Banco de dados já aberto. Reutilizando.');
    return db;
  }
  try {
    // openDatabaseAsync é a forma moderna e assíncrona
    db = await SQLite.openDatabaseAsync('locations.db');
    console.log('database.js: Banco de dados "locations.db" aberto com sucesso (assíncrono).');
    return db;
  } catch (error) {
    console.error('database.js: ERRO ao abrir o banco de dados "locations.db" (assíncrono):', error);
    throw error; // Propagar o erro para quem chamar getDb
  }
}

// Função para inicializar o banco de dados (criar tabela se não existir)
async function initDatabase() {
  console.log('initDatabase: Iniciando função para inicializar o banco de dados.');
  try {
    const database = await getDb(); // Obtenha a instância do DB
    const createTableSQL = 'CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL);';
    console.log('initDatabase: Executando SQL para criar tabela:', createTableSQL);
    // Use .execAsync para comandos DDL (CREATE TABLE)
    await database.execAsync(createTableSQL);
    console.log('initDatabase: Tabela locations criada com sucesso ou já existente.');
  } catch (error) {
    console.error('initDatabase: ERRO ao criar tabela locations:', error);
  }
  console.log('initDatabase: Função de inicialização do banco de dados concluída.');
}

// Função para salvar uma localização
async function saveLocationToDatabase(location) {
  console.log('saveLocationToDatabase: Iniciando função para salvar localização.');
  console.log('saveLocationToDatabase: Localização a ser salva:', location);
  try {
    const database = await getDb(); // Obtenha a instância do DB
    const insertSQL = 'INSERT INTO locations (latitude, longitude) VALUES (?, ?);';
    const params = [location.latitude, location.longitude];
    console.log('saveLocationToDatabase: Executando SQL para inserir:', insertSQL, 'com parâmetros:', params);
    // Use .runAsync para operações INSERT, UPDATE, DELETE
    await database.runAsync(insertSQL, params);
    console.log('saveLocationToDatabase: Localização salva com sucesso!');
  } catch (error) {
    console.error('saveLocationToDatabase: ERRO ao salvar localização:', error);
  }
  console.log('saveLocationToDatabase: Função de salvar localização concluída.');
}

// Função para carregar localizações
async function loadLocationsFromDatabase() {
  console.log('loadLocationsFromDatabase: Iniciando função para carregar localizações.');
  try {
    const database = await getDb(); // Obtenha a instância do DB
    const selectSQL = 'SELECT * FROM locations;';
    console.log('loadLocationsFromDatabase: Executando SQL para selecionar:', selectSQL);
    // Use .getAllAsync para obter todas as linhas de uma consulta SELECT
    const results = await database.getAllAsync(selectSQL);
    console.log('loadLocationsFromDatabase: Retorno bruto de getAllAsync (SELECT):', results);

    if (Array.isArray(results)) {
      console.log('loadLocationsFromDatabase: O retorno de getAllAsync É um array. Quantidade de linhas:', results.length);
      if (results.length === 0) {
        console.log('loadLocationsFromDatabase: O array de resultados está vazio. Nenhuma localização no DB.');
      }
      // getAllAsync já retorna um array de objetos onde as chaves são os nomes das colunas
      const locations = results.map(row => ({
        id: row.id,
        latitude: row.latitude,
        longitude: row.longitude,
      }));
      console.log('loadLocationsFromDatabase: Localizações carregadas e formatadas:', locations);
      return locations;
    } else {
      console.log('loadLocationsFromDatabase: O retorno de getAllAsync NÃO É um array. Formato inesperado.');
      return [];
    }
  } catch (error) {
    console.error('loadLocationsFromDatabase: ERRO ao carregar localizações:', error);
    return []; // Retornar um array vazio em caso de erro
  }
  console.log('loadLocationsFromDatabase: Função de carregar localizações concluída.');
}

// Função para deletar todas as localizações
async function deleteLocationsFromDatabase() {
    console.log('deleteLocationsFromDatabase: Iniciando função para deletar todas as localizações.');
    try {
      const database = await getDb(); // Obtenha a instância do DB
      const deleteSQL = 'DELETE FROM locations;';
      console.log('deleteLocationsFromDatabase: Executando SQL para deletar:', deleteSQL);
      await database.runAsync(deleteSQL);
      console.log('deleteLocationsFromDatabase: Todas as localizações deletadas com sucesso!');
    } catch (error) {
      console.error('deleteLocationsFromDatabase: ERRO ao deletar localizações:', error);
    }
    console.log('deleteLocationsFromDatabase: Função de deletar localizações concluída.');
  }

  export { initDatabase, saveLocationToDatabase, loadLocationsFromDatabase, deleteLocationsFromDatabase };