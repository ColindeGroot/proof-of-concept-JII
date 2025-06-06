import express, { request } from 'express';
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express-applicatie aan
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('view engine', 'liquid');
app.set('views', './views');

app.get('/', async (request, res) => {
    try{
        const experimentsResponse = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments?status=published')
        const experimentsResponseJSON = await experimentsResponse.json();
        // console.log(experimentsResponseJSON)
        res.render('index.liquid', { experiments: experimentsResponseJSON })
    }
    catch (error){
        console.error(error)
        res.status(500).send(error)
    }
});


app.get('/experiment/:id', async (req, res) => {
  try {
 
    const experimentId = req.params.id;

  
    const homeResponse = await fetch(`https://open-jii-api-mock.onrender.com/api/v1/experiments/${experimentId}`);
    if (!homeResponse.ok) {
      return res.status(homeResponse.status).send("Experiment niet gevonden");
    }

    const experimentData = await homeResponse.json();

    res.render('experiment', { experiment: experimentData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Er ging iets mis bij het ophalen van het experiment.");
  }
});


// Stel de poort in
const PORT = process.env.PORT || 8001;

// Start de server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
