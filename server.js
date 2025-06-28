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
    const experimentsResponse = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments?status=published');
    const experimentsJSON = await experimentsResponse.json();

    const sort = req.query.sort === 'oldest' ? 'oldest' : 'recent';

    const experiments = experimentsJSON.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      // recent = dateB - dateA
      return sort === 'recent' ? dateB - dateA : dateA - dateB; //sort function most and least recent experiments based on creationdate
    });

    res.render('index.liquid', { experiments, sort });

});



app.get('/experiment/:id', async (req, res) => {
  // make a page for the selected project on the homepage
  const experimentId = req.params.id;

  const homeResponse = await fetch(`https://open-jii-api-mock.onrender.com/api/v1/experiments/${experimentId}`); //get the data of selected project with the filter

  const experimentData = await homeResponse.json();

  let experimentColumns // create columns

  if (experimentData.data) { // add data if the experiments contains data
    experimentColumns = experimentData.data.columns // this prevents a experiment from returning null if experiments column doesnt contain data
  }

  // console.log(experimentColumns) 

  res.render('experiment', { experiment: experimentData, column: experimentColumns });
});

app.post('/create-experiment', async (req, res) => {
  const { name, description, data } = req.body;
  // ... maak payload en post naar je API ...
  const apiRes = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: uuidv4(),
      name,
      description,
      data,
      status: "published", // Setting everything on public for now since this is still in testing fase and all post should be directly visible for testing pruposes
      visibility: "public", // same thing for the others
      embargoIntervalDays: 0,
      createdAt: (new Date()).toISOString(), 
      updatedAt: (new Date()).toISOString()  
    })
  });

  if (!apiRes.ok) {
    return res.status(apiRes.status).redirect('/');
  }

  const created = await apiRes.json();
  const newId = created.id; // get id of the new created experiment

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ id: newId }); //send json to client side js
    // we need the experiment id on the client side as well if we want to have the redirect to occur AFTER the user feedback
    // if it's not supported the user will be redirected to the page without the enhanched feedback
  }

  res.redirect(`/experiment/${newId}`);
});


app.post('/experiment/:id/delete', async (req, res) => {

  const { id } = req.params;
  await fetch(
    `https://open-jii-api-mock.onrender.com/api/v1/experiments/${id}`,
    { method: 'DELETE' }
  );

  return res.redirect('/');

});


// Set PORT
const PORT = process.env.PORT || 8001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
