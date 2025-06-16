import express, { request } from 'express';
import { v4 as uuidv4 } from 'uuid'; // creating a uuid for the post's id
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
    // make a page for the selected project on the homepage
    const experimentId = req.params.id;

    const homeResponse = await fetch(`https://open-jii-api-mock.onrender.com/api/v1/experiments/${experimentId}`); //get the data of selected project with the filter

    const experimentData = await homeResponse.json();

    let experimentColumns

    if (experimentData.data){ 
       experimentColumns = experimentData.data.columns
    }
    // console.log(experimentColumns) 

    res.render('experiment', { experiment: experimentData, column: experimentColumns});
});

app.post('/create-experiment', async (req, res) => {
  try {
    //Get data from the input fields and pass them to the POST 
    const { name, description } = req.body;

    const response = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: uuidv4(), //render requires a uuid to be able to search on id. When posting the posted experiment doesnt get an 
        name,
        description,
        status: "published", // Setting everything on public for now since this is still in testing fase and all post should be directly visible for testing pruposes
        visibility: "public", // same thing for the others
        embargoIntervalDays: 0,
        createdAt: (new Date()).toISOString()  //doesn't get pushed otherwise
      })
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong deleting the experiment.', error);
  }
});

app.post('/experiment/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `https://open-jii-api-mock.onrender.com/api/v1/experiments/${id}`,
      { method: 'DELETE' }
    );

    return res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting experiment!');
  }
});


// Set PORT
const PORT = process.env.PORT || 8001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
