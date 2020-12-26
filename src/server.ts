import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

var validUrl = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req: Request, res: Response) => {
      let { image_url } = req.query;

      //Check if an image url is included in query paramter
      if ( !image_url ) {
          return res.status(400)
                  .send(`Image URL is required`);
      }
      
      //check if the image url is valid  
      if (!validUrl.isUri(image_url)){
          return res.status(422)
                  .send("Not a valid image URl. Plese check and try again");
      } 
      
      //call filterImageFromURL(image_url) to filter the image, send the resulting file in the response and deletes any files on the server 
      const filteredImageURL:string =  await filterImageFromURL( image_url );
      res.sendFile( filteredImageURL,  () => {
          deleteLocalFiles([filteredImageURL]);
      });
  });
  

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}} hooray")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();