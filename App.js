import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  List,
  PaperProvider,
  Switch,
  Text,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import myColors from "./assets/colors.json";
import myColorsDark from "./assets/colorsDark.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Database from './database';


export default function App() {
  const [isSwitchOn, setIsSwitchOn] = useState(false); // variável para controle do darkMode
  const [isLoading, setIsLoading] = useState(false); // variável para controle do loading do button
  const [locations, setLocations] = useState(null); // variável para armazenar as localizações

  // Carrega tema default da lib RN PAPER com customização das cores. Para customizar o tema, veja:
  // https://callstack.github.io/react-native-paper/docs/guides/theming/#creating-dynamic-theme-colors
  const [theme, setTheme] = useState({
    ...DefaultTheme,
    myOwnProperty: true,
    colors: myColors.colors,
  });

  // load darkMode from AsyncStorage
  async function loadDarkMode() {
    try {
      const value = await AsyncStorage.getItem('darkModeEnabled');
      if (value !== null) {
        setIsSwitchOn(JSON.parse(value));
      }
    } catch (e) {
      console.error("Failed to load dark mode preference.", e);
    }
  }

  // darkMode switch event
async function onToggleSwitch() {
  const newState = !isSwitchOn;
  setIsSwitchOn(newState);
  try {
    await AsyncStorage.setItem('darkModeEnabled', JSON.stringify(newState));
  } catch (e) {
    console.error("Failed to save dark mode preference.", e);
  }
}

  // get location (bottao capturar localização)
  async function getLocation() {
    setIsLoading(true);
  
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      setIsLoading(false);
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    const newLocation = {
      id: new Date().getTime(), // Usar um ID único, como timestamp
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  
    // Adicionar a nova localização ao estado 'locations'
    // Isso fará com que a FlatList seja atualizada
    setLocations(prevLocations => [...(prevLocations || []), newLocation]);
  
  
    // **Aqui você chamará a função para salvar no SQLite (próximo passo)**
    Database.saveLocationToDatabase(newLocation);
  
    setIsLoading(false);
  }

  // load locations from db sqlite - faz a leitura das localizações salvas no banco de dados
  async function loadLocations() {
    setIsLoading(true);
    try {
      const loadedLocations = await Database.loadLocationsFromDatabase();
      setLocations(loadedLocations);
    } catch (error) {
      console.error("Erro ao carregar localizações do banco de dados:", error);
      setLocations([]); // Definir como array vazio em caso de erro
    }
    setIsLoading(false);
  }

  async function clearLocations() {
    setIsLoading(true);
    try {
      await Database.deleteLocationsFromDatabase();
      setLocations([]); // Limpa a lista no estado do componente
      console.log('Localizações limpas na UI.');
    } catch (error) {
      console.error('Erro ao limpar localizações:', error);
    }
    setIsLoading(false);
  }

  // Use Effect para carregar o darkMode e as localizações salvas no banco de dados
  // É executado apenas uma vez, quando o componente é montado
  useEffect(() => {
    loadDarkMode();
    Database.initDatabase();
    loadLocations();
  }, []);

  // Efetiva a alteração do tema dark/light quando a variável isSwitchOn é alterada
  // É executado sempre que a variável isSwitchOn é alterada
  useEffect(() => {
    if (isSwitchOn) {
      setTheme({ ...theme, colors: myColorsDark.colors });
    } else {
      setTheme({ ...theme, colors: myColors.colors });
    }
  }, [isSwitchOn]);

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="My Location BASE" />
      </Appbar.Header>
      <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
                <View style={styles.containerDarkMode}>
          <Text>Dark Mode</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        <Button
  style={styles.containerButton}
  icon="map"
  mode="contained"
  loading={isLoading}
  onPress={() => getLocation()}
>
  Capturar localização
</Button>

{/* Novo botão para limpar localizações */}
<Button
  style={styles.containerButton}
  icon="trash-can" // Ícone de lixeira, ou outro de sua preferência
  mode="outlined" // Para diferenciá-lo do botão principal
  loading={isLoading}
  onPress={() => clearLocations()}
>
  Limpar localizações
</Button>

        <FlatList
          style={styles.containerList}
          data={locations}
          renderItem={({ item }) => (
            <List.Item
              title={`Localização ${item.id}`}
              description={`Latitude: ${item.latitude} | Longitude: ${item.longitude}`}
            ></List.Item>
          )}
        ></FlatList>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerDarkMode: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerButton: {
    margin: 10,
  },
  mainContainer: {
    flex: 1,
  },
  containerList: {
    margin: 10,
  },
});
