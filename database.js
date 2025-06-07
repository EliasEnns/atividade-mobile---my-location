import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('locations.db');

// Função para inicializar o banco de dados (criar tabela se não existir)
async function initDatabase() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL);',
      [],
      () => console.log('Tabela locations criada com sucesso ou já existente.'),
      (_, error) => console.error('Erro ao criar tabela locations:', error)
    );
  });
}

// Função para salvar uma localização
async function saveLocationToDatabase(location) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO locations (latitude, longitude) VALUES (?, ?);',
      [location.latitude, location.longitude],
      () => console.log('Localização salva com sucesso!'),
      (_, error) => console.error('Erro ao salvar localização:', error)
    );
  });
}

// Função para carregar localizações
async function loadLocationsFromDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM locations;',
        [],
        (_, { rows }) => {
          console.log('Localizações carregadas:', rows._array);
          resolve(rows._array);
        },
        (_, error) => {
          console.error('Erro ao carregar localizações:', error);
          reject(error);
        }
      );
    });
  });
}