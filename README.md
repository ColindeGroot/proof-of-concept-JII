# Open JII - Dashbaord

JII researchers aim to integrate knowledge and technology into an accessible, open platform that will move the science beyond the confines of the traditional laboratory and use the real world as the laboratory. Using advanced photosynthesis sensors and data science tools, they continuously record in detail how photosynthesis responds to changes in, for example, light.

This dashboard is meant to help store and view the results of those experiments.


## About the dashboard

Users have the option to create, view and delete experiments. This dashbaord does not include a login system since this is a mockup. 

The dashbaord is made using express for serverside rendering, liquid for templating and dynamic rendering and also contains CSS and client side JS for enhanchments.
The website is fully functional with js disabled and is accesible for all kind of users.

### Creating experiments

Users can create their own experiment in a form that is located in an aside that opens when users press the create experiment button on the homepage.
With a POST route in express users have the option to POST the experiment name, description and some data for the experiment (this is still under development).


