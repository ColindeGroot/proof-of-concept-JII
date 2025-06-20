# Open JII - Dashbaord

JII researchers aim to integrate knowledge and technology into an accessible, open platform that will move the science beyond the confines of the traditional laboratory and use the real world as the laboratory. Using advanced photosynthesis sensors and data science tools, they continuously record in detail how photosynthesis responds to changes in, for example, light.

This dashboard is meant to help store and view the results of those experiments.


## About the dashboard

![localhost_8001_](https://github.com/user-attachments/assets/58415d17-aad3-4131-8d1f-62d8871fecc7)

Users can create, view, and delete experiments. This dashboard does not include an authentication system, since it’s intended as a mockup.

The dashboard is built with Express for server‑side rendering, Liquid for templating and dynamic views, CSS and client‑side JavaScript for enhancements.
The site works fully with JavaScript disabled and is accessible to all users.

### Experiment page

Each experiment’s data, stored on the server, is rendered on its own page.
The experiment page consists of a title, description, some info about the creation date and a table with the data of the experiment:

![localhost_8001_experiment_1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6](https://github.com/user-attachments/assets/ea424f7c-d511-45f8-8389-a8d714fca32c)

### Creating and deleting experiments

Users can create their own experiment in a form that is located in an aside that opens when users press the create experiment button on the homepage.
With a POST route in express users have the option to POST the experiment name, description and some data for the experiment (this is still under development).

``` JS

app.post('/create-experiment', async (req, res) => {
  const { name, description, data } = req.body; // get the content the user filled in in the fields

  const response = await fetch('https://open-jii-api-mock.onrender.com/api/v1/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: uuidv4(), 
      name,
      description,
      data,
      status: "published", 
      visibility: "public", 
      embargoIntervalDays: 0,
      createdAt: (new Date()).toISOString(),  
      updatedAt: (new Date()).toISOString()
    })
  });

```
In the post you can see the id is being pushed with an uuid. This because render (the mockup server) doesnt assign one automaticly when posting.

![localhost_8001_ (1)](https://github.com/user-attachments/assets/51390e66-ff3d-41a7-9b31-054e4b45b066)

In order to delete experiments the server has a route in which we target the id of the experiment we want to delete:
``` JS
const { id } = req.params;
  const response = await fetch(
    `https://open-jii-api-mock.onrender.com/api/v1/experiments/${id}`,
    { method: 'DELETE' }
  );

```

### Accessibility

In this project, all core functionalities are progressively enhanced in order to make the website as accessable as possible. One of those feautres is the aside that opens when you press the create experiment "button".

This button is an anchor tag which targets the aside. Then with css the aside wil be shown:
``` HTML
<a href="#post-form" class="button button-light" id="open-aside">Create Experiment</a>
```

``` CSS

/* aside looks something like this */
aside {
        position: fixed;
        top: 0;
        left: -100%; /* with a negative left i leave the aside outside of the screen */
}

 #post-form:target {
        left: 0; /* this puts the aside back on the screen making it look like it "opened" */
    }

```
This contains no JS at all!

### Enhanched user experience

The dashbaord uses client side JS for enchanments which gives the user a better experience. An example is a live reload of the epxeriments when you make a POST request. By reloading the page after posting you can see the result instead of having to refresh your browser.

Here a shorter version of the script:
``` JS

 if ('fetch' in window && 'DOMParser' in window) {

    document.addEventListener('submit', async function (event) { // create an event

      const form = event.target;

      if (!form.hasAttribute('data-enhanced')) return; in html the form will be given the 'data-enchanched' atribute

      event.preventDefault(); //prevent the default refresh of the browser

      submitButton.disabled = true;
      submitButton.innerHTML = 'Creating...'; // giving user feedback that the experiment is being created

      const response = await fetch(form.action, { //send request to the server
        method: form.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      });

      submitButton.innerHTML = 'Experiment added!'; //show user the creating was succesfull

      setTimeout(() => { //reload so user may see the new experiment
        window.location.reload();
      }, 2500);
    })
  };

```

## How to use

In order to work on this project or run it locally you must need to install node.

When you have node installed on your device and have all the packages installed ( npm install ) you can start the project.

To start the poject type the following command in the terminal:
```JS
npm run dev
```

I'm using dev dependencies like nodemon for a better workflow. 

If you wish to work without those you can simply type:
```JS 
npm start
```




