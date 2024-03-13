var Message = require('../models/Message');
var fs = require('fs');
var path = require('path');

exports.fileDownload = async function(req, res, next) {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    console.log(filePath, 'filePath')
    
    // Set the appropriate headers to trigger a file download
    fs.exists(filePath, function(exists) {
        if (exists) {
            // Set the appropriate headers to trigger a file download
            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-type', 'application/octet-stream');
            res.setHeader('Content-Length', fs.statSync(filePath).size); // Set content length

            // Send the file to the client
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    });
}

exports.saveMessage = async function(data) {
    try {
        const { avatar, sender, text, room, type, file_name } = data;
        console.log(sender, 'sender')
        const newMessage = new Message({ avatar, sender, text, room, type, file_name });
        await newMessage.save();
      } catch (err) {
        console.error('Error saving message:', err);
      }
}

exports.getMessage = async function(roomId) {
    try {
        const messages = await Message.find({ room: roomId }).populate('sender');
        return messages;
      } catch (error) {
        console.error('Error fetching messages for room:', error);
        throw error;
      }
}
