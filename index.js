const express = require('express');
const fs	  = require('fs')  	  ;
const port = process.env.PORT || 3000;

const lang = process.env.LANG.slice(0, 2);
const app = express();

app.get('/', (req, res) =>
{
	let indexHTML = fs.readFileSync(__dirname + '/public/html/en/index.html', 'utf-8');

	if (lang === 'fr')
	{
		indexHTML = fs.readFileSync(__dirname + "/public/html/fr/index.html", 'utf-8');
	}
	  res.send(indexHTML);
});
app.use(express.static(__dirname + '/public/css'));

app.listen(port, () => 
{
	  console.log(`Server is running on port ${port}`);
	  console.log(`Language is ${lang}`);
});
