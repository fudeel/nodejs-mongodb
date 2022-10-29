
export const uploadProfilePhoto = (req, res) => {
    let file = req.file;
    console.log("File uploaded: ", file.filename);


    res.status(200).send({
        error: false,
        message: 'file uploaded'
    });
}
