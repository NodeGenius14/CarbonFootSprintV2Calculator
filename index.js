/*@author Arthur Lecomte <arthurlecomtefr@gmail.com> 
          & Baptiste Dudonné <bapt.14@hotmail.com> */ 

const express = require('express');
const fs	  = require('fs')  	  ;
const port = process.env.PORT || 3000;

const lang = process.env.LANG.slice(0, 2);
const app = express();


const path = require('path');
const fontsPath = path.join(__dirname, 'fonts'); // Chemin vers le dossier des polices

app.use('/fonts', express.static(fontsPath));



app.get('/', (__, res) =>
{
	let indexHTML = fs.readFileSync(__dirname + '/public/html/en/index.html', 'utf-8');

	if (lang === 'fr')
	{
		indexHTML = fs.readFileSync(__dirname + "/public/html/fr/index.html", 'utf-8');
	}
	  res.send(indexHTML);
});
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/src'));
app.use(express.static('public/img'));
app.use(express.static('public/fonts'));



app.get("/result", (req, res, next) => {
	try {
	  let HTML = fs.readFileSync(__dirname + "/public/html/en/result.html", 'utf-8');
	  if (lang === "fr") {
		HTML = fs.readFileSync(__dirname + "/public/html/fr/result.html", 'utf-8');
	  }
	  res.send(HTML);
	} catch (error) {
	  next(error);
	}
  });
  
  app.get("/*", (__, res) =>
  {
	  let HTML = fs.readFileSync(__dirname + "/public/html/en/404.html", 'utf-8');
		if (lang ==="fr")
		{
			HTML = fs.readFileSync(__dirname + "/public/html/fr/404.html", 'utf-8');
		}
	  res.send(HTML);
  });
  



app.listen(port, () => 
{
	  console.log(`Server is running on port ${port}`);
	  console.log(`Language is ${lang}`);
});
