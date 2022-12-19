
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function
) => {
  
  if(!file) return callback(new Error('File is empty.'), false); // El false significa que NO estamos aceptando el archivo.

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

  if(validExtensions.includes(fileExtension)) return callback(null, true);
  // El true significa que SÍ estamos aceptando el archivo.

  callback(null, false);
};