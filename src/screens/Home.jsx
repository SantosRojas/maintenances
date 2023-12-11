import { Container, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import CustomizedTreeView from "../components/CustomizedTreeView";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ssttapi.mibbraun.pe/mantenimientos");
        if (!response.ok) {
          throw new Error('Hubo un problema con la petición Fetch: ' + response.status);
        }
        const data = await response.json();
        setDatos(data)
      } catch (error) {
        console.error(error);
        alert(error); // Muestra un pop-up de error
      }
    };

    fetchData();

  }, []);

  if (!datos) {
    return (
      <Container>
        <p>Cargando datos...</p>
      </Container>
    );
  }


  return (
    <>
      {/* <NavBar
        currentUser={currentUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
      /> */}

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          marginTop: "1rem"
        }}
      >
        <Paper elevation={3}
          sx={{ width: "100%" }}>
          <CustomizedTreeView data={[...datos].reverse()} />
          <div style={{display:"flex",width:"100%",alignItems:"center",justifyContent:"center"}}>
            <Button onClick={(e) => navigate("/add")}>Add Maintenance</Button>
          </div>
        </Paper>
      </Container>
    </>
  )
}

export default Home;