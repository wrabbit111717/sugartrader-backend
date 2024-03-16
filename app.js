var fs = require('fs');
var http = require('http');
var https = require('https');
const cors = require('cors');
const FormData = require('form-data');
const { Readable } = require('stream');
// var privateKey  = fs.readFileSync('sslcert/key.pem');
// var certificate = fs.readFileSync('sslcert/cert.pem');

var createError = require('http-errors');
var express = require('express');
const socketIo = require('socket.io');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var Message = require('./models/Message');
var Negotiation = require('./models/Negotiation');
const { getMessage, saveMessage } = require('./controllers/MessageController');
const fileURLToPath = require('url');
// var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

var port = 8080;

// var credentials = {key: privateKey, cert: certificate};

/** MongoDB connect */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
});
/** End DB connect */

/** Import Router */
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var offerRouter = require('./routes/offer');
var messageRouter = require('./routes/message');
var negotiationRouter = require('./routes/negotiation');
/** End Import Router */


var app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: 'http://sugartrade.com.br', // Update with your Next.js client URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'], // Add necessary headers for chat and file upload
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('A user connected');

  // socket.on('join room', (offerId) => {
  //   // Check if the offerId room already exists
  //   console.log(offerId, 'offerId');
  //   const activeUsers = new Map(); // Define activeUsers map to store offerId and corresponding socket.id
  //   if (activeUsers.has(offerId)) {
  //     const otherUser = activeUsers.get(offerId);

  //     // Join rooms for both users to enable communication
  //     socket.join(offerId);
  //     io.sockets.sockets.get(otherUser).join(offerId);

  //     // Notify users that they have entered the room
  //     io.to(offerId).emit('room joined', `You are now in a chat room with ${socket.id}`);

  //     // Remove the offerId from activeUsers as the room is created
  //     activeUsers.delete(offerId);
  //   } else {
  //     // If the room doesn't exist, add the user with their offerId
  //     activeUsers.set(offerId, socket.id);
  //   }
  // });

  socket.on('join room', async (room) => {
    try {
      // Fetch all messages for the offerId room
      const messages = await getMessage(room);
      
      // Join the room
      socket.join(room);
  
      // Emit all messages to the user who just joined the room
      socket.emit('all messages', messages);
  
      // Notify the user that they have entered the room
      socket.emit('room joined', `You are now in a chat room ${room}`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  socket.on('chat message', async ({ room, fileData, fileName, message, senderId }) => {
    console.log(senderId, 'senderId')
    if(fileData) {
      console.log('fileData')

      const writeStream = fs.createWriteStream(`uploads/${fileName}`);
  
      // Convert ArrayBuffer to a buffer
      const buffer = Buffer.from(fileData);
    
      // Write the buffer to the file
      writeStream.write(buffer);
    
      writeStream.on('finish', async () => {
        console.log(`File uploaded by user ${senderId} in room ${room}: ${fileName}`);        
        await Negotiation.findOneAndUpdate(
          { _id: room }, // Query: find record by ID
          { status: false }, // New data: update stage field only
          { new: true } // Options: return the modified document after update
        );

      });
  
      writeStream.on('error', (err) => {
        console.error(`Error uploading file ${fileName}:`, err);
      });
    
      writeStream.end();  
    }
    try {
      // Save the message to the database using the controller function
      // type 0: text, 1: file
      await saveMessage({ avatar: '', sender: senderId, text: message, room: room, type: fileData ? 1 : 0, file_name: fileName ? fileName : '' });
      const latestMessage = await Message.findOne({ room: room }).sort({ createdAt: -1 }).populate('sender');

      socket.to(room).emit('chat message', latestMessage);

    } catch (error) {
      console.error('Error saving message:', error);
    }

    
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');

    // Remove the user from the activeUsers map when they disconnect
  });
});


var corsOptions = {
  origin: "http://sugartrade.com.br",
  // origin: "http://nardechain.io",
  methods: "POST, GET, PUT, DELETE",
};
app.use(cors(corsOptions));
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

// view engine setup
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.set('view engine', 'ejs');

// const domain = 'social-media-builder.com';

// const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8');
// const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8');
// const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const buildPath = path.join(__dirname, "_next/server/pages");
app.use(express.static(buildPath));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/offer', offerRouter);
app.use('/message', messageRouter);
app.use('/negotiation', negotiationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title : 'CMS | Have something wrong', session : req.session, recent_url : req.url});
});

app.get("*", (req, res) => {
  return handle(req, res);
});

// app.listen(port, function() {
//   console.log(`This app is running on localhost:${port}`);
// });
// module.exports = app;

// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(443, function() {
//   console.log(`This app is running on https://www.social-media-builder.com`);
// });

// module.exports = httpsServer;

// Starting both http & https servers

// const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
	console.log('HTTP Server running on port 8080');
});

// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443');
// });
