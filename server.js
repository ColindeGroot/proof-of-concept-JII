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

app.get('/', async (req, res) => {
  try {
    const experimentsResponse = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments?status=published')
    const experimentsResponseJSON = await experimentsResponse.json();
    // console.log(experimentsResponseJSON)

    const experiments = [];
    experiments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); //sort experiments from new to old 


    res.render('index.liquid', { experiments: experimentsResponseJSON })
  }
  catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}); 


app.get('/experiment/:id', async (req, res) => {
  try {
    // make a page for the selected project on the homepage
    const experimentId = req.params.id;

    const homeResponse = await fetch(`https://open-jii-api-mock.onrender.com/api/v1/experiments/${experimentId}`); //get the data of selected project with the filter
    if (!homeResponse.ok) {
      return res.status(homeResponse.status).send("Experiment not found");
    }

    const experimentData = await homeResponse.json();

    res.render('experiment', { experiment: experimentData });
  } catch (error) {
    console.error(error);
    res.status(500).send("something went wrong");
  }
});

app.post('/create-experiment', async (req, res) => {
  try {
    //Get data from the input fields and pass them to the POST 
    const { name, description } = req.body;

    const response = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        status: "published", // Setting everything on public for now since this is still in testing fase and all post should be directly visible for testing pruposes
        visibility: "public", // same thing for the others
        embargoIntervalDays: 0,
        createdAt: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    // Redirect back to home after posting
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Er ging iets mis bij het maken van een experiment.');
  }
});





// Stel de poort in
const PORT = process.env.PORT || 8001;

// Start de server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
